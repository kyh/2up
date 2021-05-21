import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useGame, gameActions } from "features/game/gameSlice";
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
  const { dispatch } = useGame();
  const [gameCreate] = useMutation<GameCreateMutation>(GAME_CREATE);

  const hostGame = async (packId: string) => {
    const { data } = await gameCreate({
      variables: { input: { packId } },
    });

    if (!data || !data.gameCreate) return;
    const gameId = data.gameCreate.code;
    dispatch(gameActions.new_game({ gameId }));
    history.push("/join");
  };

  return hostGame;
};
