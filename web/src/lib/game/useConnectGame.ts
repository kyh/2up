import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "~/utils/supabase";
import { useAlert } from "~/components";
import { useGameStore, GameState } from "~/lib/game/gameStore";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";
import type { Players } from "~/lib/game/steps/types";

export const useConnectGame = (gameId: string) => {
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const alert = useAlert();

  const setGameState = useGameStore((state) => state.setGameState);
  const setGameStarted = useGameStore((state) => state.setIsStarted);
  const setGameFinished = useGameStore((state) => state.setIsFinished);

  const setPlayers = useGameStore((state) => state.setPlayers);
  const playerId = usePlayhouseStore((state) => state.playerId);
  const playerName = usePlayhouseStore((state) => state.playerName);

  useEffect(() => {
    const initializeGameState = async () => {
      try {
        const { data } = await supabase
          .from("Game")
          .select("*")
          .eq("id", gameId)
          .single();

        console.log("Initialize game state", data);
        setGameState(data.state);
        setGameStarted(data.isStarted);
        setGameFinished(data.isFinished);

        setInitialized(true);
      } catch (error: any) {
        handleError(error);
      }
    };

    if (gameId) initializeGameState();
  }, [gameId]);

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
              score: p.score,
              prevScore: p.prevScore,
              isSpectator: p.isSpectator,
            } as Players[0])
        );

        setPlayers(players);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await playerChannel.track({
            userId: playerId,
            name: playerName,
            score: 0,
            prevScore: 0,
            isSpectator: false,
          });
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
          filter: `id=eq.${gameId}`,
        },
        (payload: {
          new: { state: GameState; isStarted: boolean; isFinished: boolean };
        }) => {
          console.log("New game state:", payload.new);
          setGameState(payload.new.state);
          setGameStarted(payload.new.isStarted);
          setGameFinished(payload.new.isFinished);
        }
      )
      .subscribe();

    gameChannel.onError(handleError);

    return () => {
      playerChannel.unsubscribe();
      gameChannel.unsubscribe();
    };
  }, [gameId]);

  const handleError = (reason: Error) => {
    console.error(reason);
    alert.show(`Error connecting to game: ${reason}`);
    router.push("/");
  };

  return initialized;
};
