import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { useAppDispatch } from "util/redux";
import { gameActions } from "features/game/gameSlice";
import { GameCreateMutation } from "./__generated__/GameCreateMutation";

const GAME_CREATE = gql`
  mutation GameCreateMutation($input: GameCreateInput!) {
    gameCreate(input: $input) {
      code
    }
  }
`;

export const useHostGame = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [gameCreate, { loading }] =
    useMutation<GameCreateMutation>(GAME_CREATE);

  const hostGame = async (packId: string, testMode = false) => {
    const { data } = await gameCreate({
      variables: { input: { packId } },
    });

    if (!data || !data.gameCreate) return;
    const gameId = data.gameCreate.code;
    const nextPath = testMode
      ? {
          pathname: "/game_name",
          query: { test: packId },
        }
      : {
          pathname: "/game_name",
        };

    dispatch(gameActions.new_game({ gameId }));
    router.push(nextPath);
  };

  return { hostGame, loading };
};
