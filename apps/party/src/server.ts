import type { Connection } from "partyserver";
import { routePartykitRequest, Server } from "partyserver";

import type {
  Player,
  PlayerMap,
  PositionMessage,
  RemoveMessage,
  SyncMessage,
  UpdateMessage,
} from "./player";
import { getColorById } from "./color";

type Env = {
  VgServer: DurableObjectNamespace<VgServer>;
};

export class VgServer extends Server {
  onConnect(connection: Connection<Player>) {
    const color = getColorById(connection.id);

    console.log("[connect]", connection.id);

    connection.setState({
      id: connection.id,
      color: color.color,
      hue: color.hue,
    });

    const players: PlayerMap = {};
    for (const ws of this.getConnections<Player>()) {
      const id = ws.id;
      const player = ws.state;
      if (id !== connection.id && player?.position?.x && player.position.y) {
        players[id] = player;
      }
    }

    const message: SyncMessage = {
      type: "sync",
      data: players,
    };
    connection.send(JSON.stringify(message));
  }

  onMessage(sender: Connection<Player>, message: string): void | Promise<void> {
    const positionMessage = JSON.parse(message) as PositionMessage;
    const prevPlayer = this.getPlayer(sender);

    const newPlayer: Player = {
      id: sender.id,
      color: prevPlayer?.color,
      hue: prevPlayer?.hue,
      lastUpdate: Date.now(),
      position: {
        x: positionMessage.data.x ?? prevPlayer?.position?.x,
        y: positionMessage.data.y ?? prevPlayer?.position?.y,
        pointer: positionMessage.data.pointer ?? prevPlayer?.position?.pointer,
        pathname:
          positionMessage.data.pathname ?? prevPlayer?.position?.pathname,
      },
    };

    this.setPlayer(sender, newPlayer);

    if (
      newPlayer.position?.x !== undefined &&
      newPlayer.position.y !== undefined
    ) {
      const message: UpdateMessage = {
        type: "update",
        data: newPlayer,
      };
      this.broadcast(JSON.stringify(message), [sender.id]);
    } else {
      const message: RemoveMessage = {
        type: "remove",
        data: {
          id: sender.id,
        },
      };
      this.broadcast(JSON.stringify(message), [sender.id]);
    }
  }

  onClose(connection: Connection<Player>) {
    console.log("[disconnect]", connection.id, connection.readyState);

    const message: RemoveMessage = {
      type: "remove",
      data: {
        id: connection.id,
      },
    };
    this.broadcast(JSON.stringify(message), []);
  }

  getPlayer(connection: Connection<Player>) {
    return connection.state;
  }

  setPlayer(connection: Connection<Player>, player: Player) {
    const prevPlayer = connection.state;

    // throttle writing to attachment to once every 50ms
    if (
      !prevPlayer?.lastUpdate ||
      (player.lastUpdate && player.lastUpdate - prevPlayer.lastUpdate > 50)
    ) {
      connection.setState({
        ...player,
      });
    }
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
