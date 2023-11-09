import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useGameStore, GameStore, GameState } from "@/lib/game/game-store";
import { useHomeStore } from "@/lib/home/home-store";
import { useGetGame } from "@/lib/game/use-game-actions";

export const useConnectGame = (gameId: string) => {
  const { supabase } = useSupabase();
  const playerChannelRef = useRef<RealtimeChannel | null>(null);
  const gameChannelRef = useRef<RealtimeChannel | null>(null);
  const [connectedPlayersChannel, setConnectedPlayersChannel] = useState(false);
  const [connectedGameChannel, setConnectedGameChannel] = useState(false);
  const { isSuccess, setGameState } = useGetGame(gameId);

  const setPlayers = useGameStore((state) => state.setPlayers);
  const playerId = useHomeStore((state) => state.playerId);
  const playerName = useHomeStore((state) => state.playerName);

  useEffect(() => {
    if (!gameId) return;

    const playerChannel = supabase
      .channel(`game:${gameId}:players`)
      .on("presence", { event: "sync" }, () => {
        const presenceState = playerChannel.presenceState();

        const players = Object.values(presenceState).map(([p]) => {
          type LivePlayer = GameStore["players"][0] & {
            isSpectator: boolean;
          };
          const player = p as unknown as LivePlayer;

          return {
            userId: player.userId,
            name: player.name,
            isSpectator: player.isSpectator,
          };
        });

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
        (payload) => {
          const newState = payload.new.state as GameState;
          console.log("New game state:", newState);
          setGameState(newState);
        }
      )
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setConnectedGameChannel(true);
        }
      });

    gameChannelRef.current = gameChannel;

    return () => {
      playerChannel.unsubscribe();
      gameChannel.unsubscribe();
    };
  }, [gameId]);

  return {
    isLoaded: isSuccess && connectedPlayersChannel && connectedGameChannel,
    playerChannelRef,
    gameChannelRef,
  };
};
