import type * as Party from "partykit/server";
import { SceneSchema } from "@2up/api/scene/scene-schema";
import { addPlayer, createGame, removePlayer, updateGame } from "@2up/game";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { objectToCamel } from "ts-case-convert";

import type { Database } from "@2up/db/database.types";
import type {
  GameState,
  LivePlayer,
  PlayerAction,
  ServerAction,
} from "@2up/game";

export default class Server implements Party.Server {
  private supabase: SupabaseClient<Database>;
  private gameState: GameState;
  private gameId: string;

  constructor(readonly party: Party.Party) {
    console.log("Room created:", party.id);
    this.gameId = "";
    this.gameState = createGame();
    this.supabase = createClient<Database>(
      this.party.env.NEXT_PUBLIC_SUPABASE_URL as string,
      this.party.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  async onStart() {
    const response = await this.supabase
      .from("games")
      .select()
      .eq("code", this.party.id)
      .single();

    if (response.error || !response.data) {
      throw response.error;
    }

    const scenes = objectToCamel(response.data.game_scenes as SceneSchema[]);

    this.gameId = response.data.id;
    this.gameState = createGame(scenes);
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

  async onMessage(
    message: string,
    sender: Party.Connection<{ player: LivePlayer }>,
  ) {
    const player = sender.state?.player;

    if (!player) return;

    const action: ServerAction = {
      ...(JSON.parse(message) as PlayerAction),
      player,
    };

    console.log(`Received action ${action.type} from user ${sender.id}`);

    this.gameState = updateGame(action, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));

    await this.supabase.rpc("update_game_state", {
      game_id: this.gameId,
      game_state: this.gameState,
    });
  }
}

Server satisfies Party.Worker;
