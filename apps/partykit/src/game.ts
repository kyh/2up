import { PrismaClient } from "@prisma/client/edge";
import type * as Party from "partykit/server";

import type {
  GameState,
  LivePlayer,
  PlayerAction,
  SceneWithAnswers,
  ServerAction,
} from "@2up/game";
import { addPlayer, createGame, removePlayer, updateGame } from "@2up/game";

export default class Server implements Party.Server {
  private db: PrismaClient;
  private gameState: GameState;

  constructor(readonly party: Party.Party) {
    console.log("Room created:", party.id);
    this.gameState = createGame();
    this.db = new PrismaClient({
      datasourceUrl: this.party.env.DATABASE_URL as string,
    });
  }

  async onStart() {
    const game = await this.db.game.findFirstOrThrow({
      where: {
        code: this.party.id,
        isActive: true,
      },
    });

    const scenes = game.scenes as unknown as SceneWithAnswers[];

    this.gameState = createGame(scenes ?? []);
  }

  onConnect(
    connection: Party.Connection,
    { request }: Party.ConnectionContext,
  ) {
    const searchParams = new URL(request.url).searchParams;
    const player = {
      id: connection.id,
      name: searchParams.get("name") ?? "Anonymous",
    };

    connection.setState({ ...connection.state, player });

    this.gameState = addPlayer(player, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));
  }

  onClose(connection: Party.Connection) {
    this.gameState = removePlayer(connection.id, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));
  }

  onMessage(message: string, sender: Party.Connection<{ player: LivePlayer }>) {
    const player = sender.state?.player;

    if (!player) return;

    const action: ServerAction = {
      ...(JSON.parse(message) as PlayerAction),
      player,
    };

    console.log(`Received action ${action.type} from user ${sender.id}`);

    this.gameState = updateGame(action, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));
  }
}

Server satisfies Party.Worker;
