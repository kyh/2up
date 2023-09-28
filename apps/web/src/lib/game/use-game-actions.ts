import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { useAlert } from "~/components";
import { useGameStore, GameState, Submission } from "~/lib/game/game-store";
import { useHomeStore } from "~/lib/home/home-store";

export const useHostGame = () => {
  const mutation = trpc.game.create.useMutation();
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
  const mutation = trpc.game.check.useMutation();
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
  const setPlayerName = useHomeStore((state) => state.setPlayerName);
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
  const mutation = trpc.game.start.useMutation();

  const startGame = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, startGame };
};

export const useGetGame = (gameId: string) => {
  const router = useRouter();
  const alert = useAlert();

  const setGameState = useGameStore((state) => state.setGameState);

  const query = trpc.game.get.useQuery(
    { gameId },
    {
      onSuccess: (game) => {
        setGameState(game.state as unknown as GameState);
      },
      onError: (error) => {
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
  };
};

export const useSubmitAnswer = () => {
  const mutation = trpc.game.submitAnswer.useMutation();

  const submitAnswer = async (
    gameId: string,
    numPlayers: number,
    submission: Submission
  ) => {
    await mutation.mutate({ gameId, numPlayers, submission });
  };

  return { ...mutation, submitAnswer };
};

export const useNextStep = () => {
  const mutation = trpc.game.nextStep.useMutation();

  const nextStep = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, nextStep };
};

export const useNextScene = () => {
  const mutation = trpc.game.nextScene.useMutation();

  const nextScene = async (gameId: string) => {
    await mutation.mutate({ gameId });
  };

  return { ...mutation, nextScene };
};
