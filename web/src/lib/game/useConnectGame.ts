import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "~/utils/supabase";
import { useAlert } from "~/components";
import { useGameStore, GameStore, GameState } from "~/lib/game/gameStore";
import { useHomeStore } from "~/lib/home/homeStore";
import { useGetGame } from "~/lib/game/useGameActions";

type GameChangePayload = {
  new: {
    state: GameState;
  };
};

export const useConnectGame = (gameId: string) => {
  const playerChannelRef = useRef<RealtimeChannel | null>(null);
  const gameChannelRef = useRef<RealtimeChannel | null>(null);
  const [connectedPlayersChannel, setConnectedPlayersChannel] = useState(false);
  const [connectedGameChannel, setConnectedGameChannel] = useState(false);
  const { isSuccess, setGameState } = useGetGame(gameId);
  const router = useRouter();
  const alert = useAlert();

  const setPlayers = useGameStore((state) => state.setPlayers);
  const playerId = useHomeStore((state) => state.playerId);
  const playerName = useHomeStore((state) => state.playerName);

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
              isSpectator: p.isSpectator,
            } as GameStore["players"][0])
        );

        setPlayers(players);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await playerChannel.track({
            userId: playerId,
            name: playerName,
            isSpectator: false,
          });
          setConnectedPlayersChannel(true);
        }
      });

    playerChannelRef.current = playerChannel;

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
        (payload: GameChangePayload) => {
          console.log("New game state:", payload.new);
          setGameState(payload.new.state);
        }
      )
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setConnectedGameChannel(true);
        }
      });

    gameChannel.onError(handleError);
    gameChannelRef.current = gameChannel;

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

  return {
    isLoaded: isSuccess && connectedPlayersChannel && connectedGameChannel,
    playerChannelRef,
    gameChannelRef,
  };
};
