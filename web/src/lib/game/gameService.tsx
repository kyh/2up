import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { useAppDispatch } from "~/utils/redux";
import { gameActions } from "~/lib/game/gameSlice";

export const useHostGame = () => {
  const mutation = trpc.proxy.game.create.useMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const hostGame = async (packId: string, testMode = false) => {
    await mutation.mutate(
      { packId },
      {
        onSuccess: ({ code }) => {
          const nextPath = testMode
            ? {
                pathname: "/game_name",
                query: { test: packId },
              }
            : {
                pathname: "/game_name",
              };

          dispatch(gameActions.new_game({ gameId: code }));
          router.push(nextPath);
        },
      }
    );
  };

  return { hostGame, loading: mutation.isLoading };
};
