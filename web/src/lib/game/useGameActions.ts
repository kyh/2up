import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { useAlert } from "~/components";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";

export const useHostGame = () => {
  const mutation = trpc.proxy.game.create.useMutation();
  const router = useRouter();
  const alert = useAlert();

  const hostGame = async (packId: string, testMode = false) => {
    await mutation.mutate(
      { packId },
      {
        onSuccess: ({ id }) => {
          router.push({
            pathname: "/",
            query: {
              gameId: id,
              join: true,
              returnTo: testMode ? packId : undefined,
            },
          });
        },
        onError: (error) => {
          alert.show(`Error creating game: ${error.message}`);
        },
      }
    );
  };

  return { ...mutation, hostGame };
};

export const useJoinGame = () => {
  const setPlayerName = usePlayhouseStore((state) => state.setPlayerName);
  const router = useRouter();

  const joinGame = async (gameId: string, playerName: string) => {
    setPlayerName(playerName);
    router.push({
      pathname: `/game/${gameId}/lobby`,
      query: { returnTo: router.query.returnTo },
    });
  };

  return { joinGame };
};

export const useStartGame = () => {
  const mutation = trpc.proxy.game.start.useMutation();

  const startGame = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, startGame };
};

export const useNextScene = () => {
  const mutation = trpc.proxy.game.nextScene.useMutation();

  const nextScene = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, nextScene };
};

export const useSubmitAnswer = () => {
  const mutation = trpc.proxy.game.submitAnswer.useMutation();

  const submitAnswer = async (gameId: string) => {
    await mutation.mutate({ gameId, submission: "" });
  };

  return { ...mutation, submitAnswer };
};

export const useEndGame = () => {
  const mutation = trpc.proxy.game.end.useMutation();

  const endGame = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, endGame };
};
