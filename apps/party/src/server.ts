import type { Connection } from "partyserver";
import { routePartykitRequest, Server } from "partyserver";

import type {
  ClientMessage,
  GameSyncMessage,
  Player,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  PlayerMap,
  PlayerUpdatedMessage,
} from "@repo/multiplayer";
import { getColorById } from "./color";

// Simplified game state for PlayroomKit
type PlayroomState = {
  players: PlayerMap;
  multiplayerState: Record<string, unknown>; // Global state managed by useMultiplayerState
};

type Env = {
  VgServer: DurableObjectNamespace<VgServer>;
};

export class VgServer extends Server {
  private state: PlayroomState = {
    players: {},
    multiplayerState: {},
  };

  onConnect(connection: Connection<Player>) {
    console.log(`🔗 Player connecting: ${connection.id}`);

    // Create new player (first player becomes host)
    const { color, hue } = getColorById(connection.id);
    const isFirstPlayer = Object.keys(this.state.players).length === 0;

    const newPlayer: Player = {
      id: connection.id,
      color,
      hue,
      lastUpdate: Date.now(),
      state: {},
      metadata: {
        isHost: isFirstPlayer,
      },
    };

    // Add player to state
    this.state.players[connection.id] = newPlayer;

    // Send current state to new player (excluding themselves)
    const otherPlayers: PlayerMap = {};
    Object.entries(this.state.players).forEach(([id, player]) => {
      if (id !== connection.id) {
        otherPlayers[id] = player;
      }
    });
    const syncMessage: GameSyncMessage<Record<string, unknown>> = {
      type: "game_sync",
      data: {
        players: otherPlayers,
        gameState: {
          multiplayerState: this.state.multiplayerState,
        },
      },
      timestamp: Date.now(),
    };
    connection.send(JSON.stringify(syncMessage));

    // Broadcast new player to others
    const joinMessage: PlayerJoinedMessage = {
      type: "player_joined",
      data: newPlayer,
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(joinMessage), [connection.id]);
    console.log(`👤 Player joined: ${connection.id}`);
  }

  onMessage(sender: Connection<Player>, message: string): void {
    try {
      const clientMessage = JSON.parse(message) as ClientMessage<
        Record<string, unknown>
      >;
      const player = this.state.players[sender.id];

      if (!player) {
        console.warn(`Message from unknown player: ${sender.id}`);
        return;
      }

      switch (clientMessage.type) {
        case "player_state_update":
          this.handlePlayerStateUpdate(sender, clientMessage);
          break;

        case "game_state_update":
          this.handleMultiplayerStateUpdate(sender, clientMessage);
          break;

        default:
          console.warn(`Unknown message type: ${clientMessage.type}`);
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  onClose(connection: Connection<Player>) {
    console.log(`🔌 Player disconnecting: ${connection.id}`);

    const leavingPlayer = this.state.players[connection.id];
    const wasHost = leavingPlayer?.metadata?.isHost === true;
    const allPlayers = Object.keys(this.state.players);

    // Reassign host if needed
    if (wasHost && allPlayers.length > 0) {
      const newHostId = allPlayers[0];
      if (newHostId && this.state.players[newHostId]) {
        this.state.players[newHostId].metadata = {
          ...this.state.players[newHostId].metadata,
          isHost: true,
        };

        console.log(`👑 New host assigned: ${newHostId}`);

        // Notify all players of host change
        const hostUpdateMessage: PlayerUpdatedMessage = {
          type: "player_updated",
          data: this.state.players[newHostId],
          timestamp: Date.now(),
        };
        this.broadcast(JSON.stringify(hostUpdateMessage), []);
      }
    }

    // Remove player
    delete this.state.players[connection.id];

    // Broadcast player left
    const leftMessage: PlayerLeftMessage = {
      type: "player_left",
      data: { id: connection.id },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(leftMessage), []);

    console.log(`👋 Player left: ${connection.id}`);
  }

  // Handle usePlayerState updates
  private handlePlayerStateUpdate(
    sender: Connection<Player>,
    message: ClientMessage<Record<string, unknown>>,
  ) {
    const player = this.state.players[sender.id];
    if (!player) return;

    // Update player state
    const updatedPlayer: Player = {
      ...player,
      state: {
        ...(player.state ?? {}),
        ...message.data,
      },
      lastUpdate: Date.now(),
    };

    this.state.players[sender.id] = updatedPlayer;

    // Broadcast update to all other players
    const updateMessage: PlayerUpdatedMessage = {
      type: "player_updated",
      data: updatedPlayer,
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(updateMessage), [sender.id]);

    console.log(`🔄 Player ${sender.id} state updated`);
  }

  // Handle useMultiplayerState updates
  private handleMultiplayerStateUpdate(
    sender: Connection<Player>,
    message: ClientMessage<{ multiplayerState?: Record<string, unknown> }>,
  ) {
    if (!message.data.multiplayerState) return;

    // Update global multiplayer state
    this.state.multiplayerState = {
      ...this.state.multiplayerState,
      ...message.data.multiplayerState,
    };

    // Broadcast updated state to all players
    const syncMessage: GameSyncMessage<Record<string, unknown>> = {
      type: "game_sync",
      data: {
        players: this.state.players,
        gameState: {
          multiplayerState: this.state.multiplayerState,
        },
      },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(syncMessage), []);

    console.log(`🌐 Multiplayer state updated by ${sender.id}`);
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
