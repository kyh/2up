import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { gameActions } from "features/game/gameSlice";
import { usePlayhouse, playhouseActions } from "features/home/playhouseSlice";

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
  const { dispatch } = usePlayhouse();
  const [gameCreate] = useMutation<GameCreateMutation>(GAME_CREATE);

  const hostGame = async (packId: string) => {
    const { data } = await gameCreate({
      variables: { input: { packId } },
    });

    if (!data || !data.gameCreate) return;
    const gameId = data.gameCreate.code;
    dispatch(gameActions.toggle_host(true));
    dispatch(playhouseActions.update_user({ name: "" }));
    dispatch(gameActions.new_game({ gameId }));
    history.push(`/game/${gameId}/lobby`);
  };

  return hostGame;
};
