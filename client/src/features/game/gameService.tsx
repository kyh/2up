import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [gameCreate] = useMutation<GameCreateMutation>(GAME_CREATE);

  const hostGame = async (packId: string, spectate = false) => {
    const { data } = await gameCreate({
      variables: { input: { packId } },
    });

    if (!data || !data.gameCreate) return;
    const gameId = data.gameCreate.code;
    dispatch(gameActions.new_game({ gameId }));
    if (spectate) {
      history.push(`/game/${gameId}/lobby/spectate`);
    } else {
      history.push("/join");
    }
  };

  return hostGame;
};
