import type { Connection } from "partyserver";
import { routePartykitRequest, Server } from "partyserver";

import type {
  ClientMessage,
  GameConfig,
  GameEventMessage,
  GameSyncMessage,
  Player,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  PlayerMap,
  PlayerUpdatedMessage,
} from "@repo/multiplayer";
import { getColorById } from "./color";

// Global game state (shared across all players)
type GameState = {
  players: PlayerMap;
  gameData: Record<string, unknown>;
};

type PlayerActionPayload = {
  action: string;
  data: unknown;
};

type Env = {
  VgServer: DurableObjectNamespace<VgServer>;
};

export class VgServer extends Server {
  private gameConfig: GameConfig<Record<string, unknown>> = {};
  private gameState: GameState = { players: {}, gameData: {} }; // Global game state (shared across all players)

  onConnect(connection: Connection<Player>) {
    // Check max players limit
    const currentPlayerCount = Object.keys(this.gameState.players).length;

    if (
      this.gameConfig.maxPlayers &&
      currentPlayerCount > this.gameConfig.maxPlayers
    ) {
      connection.close(1000, "Game is full");
      return;
    }

    // Initialize player with basic info
    const { color, hue } = getColorById(connection.id);
    const newPlayer: Player = {
      id: connection.id,
      color,
      hue,
      lastUpdate: Date.now(),
      state: {},
      metadata: {},
    };

    // Store player in global game state
    this.gameState.players[connection.id] = newPlayer;

    // Send initial sync to new player
    const existingPlayers: PlayerMap = {};
    Object.entries(this.gameState.players).forEach(([id, player]) => {
      if (id !== connection.id) {
        existingPlayers[id] = player;
      }
    });
    const syncMessage: GameSyncMessage<Record<string, unknown>> = {
      type: "game_sync",
      data: {
        players: existingPlayers,
        gameState: this.gameState.gameData,
      },
      timestamp: Date.now(),
    };
    connection.send(JSON.stringify(syncMessage));

    // Broadcast player joined to others
    const joinMessage: PlayerJoinedMessage = {
      type: "player_joined",
      data: newPlayer,
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(joinMessage), [connection.id]);
  }

  onMessage(sender: Connection<Player>, message: string): void | Promise<void> {
    try {
      const clientMessage = JSON.parse(message) as ClientMessage<unknown>;
      const player = this.gameState.players[sender.id];

      if (!player) return;

      switch (clientMessage.type) {
        case "player_state_update":
          this.handlePlayerStateUpdate(
            sender,
            clientMessage as ClientMessage<Partial<Record<string, unknown>>>,
          );
          break;

        case "game_state_update":
          this.handleGameStateUpdate(
            sender,
            clientMessage as ClientMessage<Partial<GameState>>,
          );
          break;

        case "game_action":
          this.handleGameAction(
            sender,
            clientMessage as ClientMessage<PlayerActionPayload>,
          );
          break;

        case "join_game":
          this.handleJoinGame(
            sender,
            clientMessage as ClientMessage<{
              config?: GameConfig<Record<string, unknown>>;
              metadata?: Record<string, unknown>;
            }>,
          );
          break;

        case "leave_game":
          this.handleLeaveGame(sender);
          break;

        case "custom":
          this.handleCustomMessage(sender, clientMessage);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  onClose(connection: Connection<Player>) {
    // Remove player from global state
    delete this.gameState.players[connection.id];

    const message: PlayerLeftMessage = {
      type: "player_left",
      data: {
        id: connection.id,
      },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(message), []);
  }

  // Handler methods
  private handlePlayerStateUpdate(
    sender: Connection<Player>,
    message: ClientMessage<Partial<Record<string, unknown>>>,
  ) {
    const prevPlayer = this.gameState.players[sender.id];
    if (!prevPlayer) return;

    // Update player state in global game state
    const updatedPlayer: Player = {
      ...prevPlayer,
      state: {
        ...(typeof prevPlayer.state === "object" && prevPlayer.state !== null
          ? prevPlayer.state
          : {}),
        ...(typeof message.data === "object" && message.data !== null
          ? message.data
          : {}),
      },
      lastUpdate: Date.now(),
    };

    this.gameState.players[sender.id] = updatedPlayer;

    // Broadcast update to other players
    const updateMessage: PlayerUpdatedMessage = {
      type: "player_updated",
      data: updatedPlayer,
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(updateMessage), [sender.id]);
  }

  private handleGameStateUpdate(
    sender: Connection<Player>,
    message: ClientMessage<Partial<Record<string, unknown>>>,
  ) {
    // Update game data in global state
    this.gameState.gameData = { ...this.gameState.gameData, ...message.data };

    // Broadcast global game state change to all players
    const syncMessage: GameSyncMessage<Record<string, unknown>> = {
      type: "game_sync",
      data: {
        players: this.gameState.players,
        gameState: this.gameState.gameData,
      },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(syncMessage), []);
  }

  private handleGameAction(
    sender: Connection<Player>,
    message: ClientMessage<PlayerActionPayload>,
  ) {
    // Broadcast game action as event to all players
    const eventMessage: GameEventMessage<PlayerActionPayload> = {
      type: "game_event",
      data: {
        event: "player_action",
        payload: message.data,
        from: sender.id,
      },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(eventMessage), []);
  }

  private handleJoinGame(
    sender: Connection<Player>,
    message: ClientMessage<{
      config?: GameConfig<Record<string, unknown>>;
      metadata?: Record<string, unknown>;
    }>,
  ) {
    // Update game config if provided
    if (message.data.config) {
      this.gameConfig = { ...this.gameConfig, ...message.data.config };
    }

    // Update player metadata in global state
    const prevPlayer = this.gameState.players[sender.id];
    if (prevPlayer && message.data.metadata) {
      const updatedPlayer: Player = {
        ...prevPlayer,
        metadata: { ...prevPlayer.metadata, ...message.data.metadata },
        lastUpdate: Date.now(),
      };
      this.gameState.players[sender.id] = updatedPlayer;
    }
  }

  private handleLeaveGame(sender: Connection<Player>) {
    sender.close(1000, "Player left game");
  }

  private handleCustomMessage(
    sender: Connection<Player>,
    message: ClientMessage<unknown>,
  ) {
    // Broadcast custom message as event
    const eventMessage: GameEventMessage<unknown> = {
      type: "game_event",
      data: {
        event: "custom_message",
        payload: message.data,
        from: sender.id,
      },
      timestamp: Date.now(),
    };
    this.broadcast(JSON.stringify(eventMessage), []);
  }

  // Utility methods
  getPlayer(playerId: string): Player | undefined {
    return this.gameState.players[playerId];
  }

  // Global game state management
  getGameState(): GameState {
    return this.gameState;
  }

  getPlayersMap(): PlayerMap {
    return this.gameState.players;
  }

  setGameConfig(config: GameConfig<Record<string, unknown>>) {
    this.gameConfig = { ...this.gameConfig, ...config };
  }

  getGameConfig(): GameConfig<Record<string, unknown>> {
    return this.gameConfig;
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
