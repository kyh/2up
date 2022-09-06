import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "~/utils/supabase";
import { useAlert } from "components";
import { useGameStore, GameState } from "~/lib/game/gameStore";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";
import { Player } from "@prisma/client";

export const useConnectGame = (gameId: string) => {
  const router = useRouter();
  const alert = useAlert();
  const setGameState = useGameStore((state) => state.setGameState);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const playerId = usePlayhouseStore((state) => state.playerId);
  const playerName = usePlayhouseStore((state) => state.playerName);

  useEffect(() => {
    if (!gameId) return;

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
        (payload: GameState) => {
          console.log(payload);
          // setGameState(payload)
        }
      )
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();

        const players = Object.values(presenceState).map(
          ([p]) =>
            ({
              userId: p.userId,
              name: p.name,
            } as Player)
        );

        setPlayers(players);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ userId: playerId, name: playerName });
        }
      });

    channel.onError((reason: string) => {
      alert.show(`Error connecting to game: ${reason}`);
      router.push("/");
    });

    return () => {
      channel.unsubscribe();
    };
  }, [gameId]);

  return {};
};
