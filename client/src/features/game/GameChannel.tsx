import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useChannel } from "utils/Socket";
import { initialState, gameActions } from "features/game/gameSlice";

export const GameContext = React.createContext({
  state: initialState,
  broadcast: (_eventName: string, _payload?: object) => {},
  dispatch: (_action: object) => {},
});

export const GameProvider: React.FC<{ gameId?: string }> = ({
  children,
  gameId,
}) => {
  const history = useHistory();
  const alert = useAlert();
  const [state, broadcast, dispatch, connected, error] = useChannel(
    `game:${gameId}`,
    (state) => state.game,
    {
      name: localStorage.getItem("name"),
      isHost: localStorage.getItem("isHost") === "true",
    },
    "game/players"
  );

  useEffect(() => {
    if (!state.gameId) {
      dispatch(gameActions.new_game({ gameId: gameId! }));
    }
    if (error) {
      dispatch(gameActions.reset());
      alert.show(error);
      history.push("/");
    }
  }, [state.gameId, gameId, error]);

  if (!connected) return null;
  return (
    <GameContext.Provider value={{ state, broadcast, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameChannel = () => {
  return useContext(GameContext);
};
