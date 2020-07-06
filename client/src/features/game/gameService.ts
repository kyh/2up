import { playhouseActions } from "features/home/playhouseSlice";
import { gameActions } from "features/game/gameSlice";

// TODO: add types here
export const hostGame = async (
  dispatch: any,
  gameCreateQuery: any,
  history: any,
  packId: any
) => {
  const { data } = await gameCreateQuery({
    variables: { input: { packId: packId || "" } },
  });

  if (!data || !data.gameCreate) return;
  const gameId = data.gameCreate.code;
  dispatch(gameActions.toggle_host(true));
  dispatch(playhouseActions.update_user({ name: "" }));
  dispatch(gameActions.new_game({ gameId }));
  history.push(`/game/${gameId}/lobby`);
};
