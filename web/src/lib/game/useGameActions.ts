import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { useAlert } from "~/components";
import { useGameStore, GameState, Submission } from "~/lib/game/gameStore";
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

export const useCheckGame = () => {
  const mutation = trpc.proxy.game.check.useMutation();
  const router = useRouter();
  const alert = useAlert();

  const checkGame = async (gameId: string) => {
    await mutation.mutate(
      { gameId },
      {
        onSuccess: ({ id }) => {
          router.replace({
            pathname: "/",
            query: { gameId: id, join: true },
          });
        },
        onError: () => {
          alert.show("Game code does not exist");
        },
      }
    );
  };

  return { ...mutation, checkGame };
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

export const useGetGame = (gameId: string) => {
  const router = useRouter();
  const alert = useAlert();

  const setGameState = useGameStore((state) => state.setGameState);
  const setGameStarted = useGameStore((state) => state.setIsStarted);
  const setGameFinished = useGameStore((state) => state.setIsFinished);

  const query = trpc.proxy.game.get.useQuery(
    { gameId },
    {
      onSuccess(game) {
        setGameState(game.state as unknown as GameState);
        setGameStarted(game.isStarted);
        setGameFinished(game.isFinished);
      },
      onError(error) {
        console.error(error);
        alert.show(`Error fetching game data: ${error.message}`);
        router.push("/");
      },
      enabled: !!gameId,
    }
  );

  return {
    ...query,
    setGameState,
    setGameStarted,
    setGameFinished,
  };
};

export const useNextStep = () => {
  const mutation = trpc.proxy.game.nextStep.useMutation();

  const nextStep = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, nextStep };
};

export const useSubmitAnswer = () => {
  const mutation = trpc.proxy.game.submitAnswer.useMutation();

  const submitAnswer = async (
    gameId: string,
    numPlayers: number,
    submission: Submission
  ) => {
    await mutation.mutate({ gameId, numPlayers, submission });
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
