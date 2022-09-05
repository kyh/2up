import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "~/utils/supabase";
import { useAlert } from "components";
import { useGameStore, GameState } from "~/lib/game/gameStore";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";

export const useConnectGame = (gameId: string) => {
  const router = useRouter();
  const alert = useAlert();
  const setGameState = useGameStore((state) => state.setGameState);
  const playerName = usePlayhouseStore((state) => state.playerName);

  useEffect(() => {
    if (!gameId) return handleError("No game id provided");

    const channel = supabase
      .channel(`game:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Game",
          filter: `id=eq.${gameId}`,
        },
        (payload: GameState) => setGameState(payload)
      )
      .on("presence", { event: "sync" }, () => {
        console.log("currently online users", channel.presenceState());
      })
      .on("presence", { event: "join" }, (data: any) => {
        console.log("a new user has joined", data);
      })
      .on("presence", { event: "leave" }, (data: any) =>
        console.log("a user has left", data)
      )
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          const status = await channel.track({ playerName });
        }
      });

    channel.onError(handleError);

    return () => {
      channel.unsubscribe();
    };
  }, [gameId]);

  const handleError = (reason: string) => {
    alert.show(`Error connecting to game: ${reason}`);
    router.push("/");
  };

  return {};
};
