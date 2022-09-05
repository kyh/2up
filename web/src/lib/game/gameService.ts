import { useEffect } from "react";
import { supabase } from "~/utils/supabase";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

export const useHostGame = () => {
  const mutation = trpc.proxy.game.create.useMutation();
  const router = useRouter();

  const hostGame = async (packId: string, testMode = false) => {
    await mutation.mutate(
      { packId },
      {
        onSuccess: ({ code }) => {
          router.push({
            pathname: "/",
            query: {
              code: code,
              join: true,
              returnTo: testMode ? packId : undefined,
            },
          });
        },
      }
    );
  };

  return { hostGame, loading: mutation.isLoading };
};

export type GameState = {
  currentStep: number;
  currentScene: number;
  sceneProps: {};
};

export const useGame = (gameId: string) => {
  useEffect(() => {
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
        (payload: GameState) => console.log(payload)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
};
