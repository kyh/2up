import { useEffect } from "react";
import { supabase } from "~/utils/supabase";
import { useGameStore, GameState } from "~/lib/game/gameStore";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";
import { Player } from "@prisma/client";

export const useConnectGame = (gameId: string) => {
  const setGameState = useGameStore((state) => state.setGameState);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const playerId = usePlayhouseStore((state) => state.playerId);
  const playerName = usePlayhouseStore((state) => state.playerName);

  useEffect(() => {
    if (!gameId) return;

    const playerChannel = supabase
      .channel(`game:${gameId}:players`)
      .on("presence", { event: "sync" }, () => {
        const presenceState = playerChannel.presenceState();

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
          await playerChannel.track({ userId: playerId, name: playerName });
        }
      });

    const gameChannel = supabase
      .channel(`public:Game:id=eq.${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Game",
        },
        (payload: GameState) => {
          console.log("payload", payload);
          // setGameState(payload)
        }
      )
      .subscribe(async (status: string) => {
        console.log("status", status);
      });

    return () => {
      playerChannel.unsubscribe();
      gameChannel.unsubscribe();
    };
  }, [gameId]);

  return {};
};
