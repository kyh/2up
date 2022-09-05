import { useContext, useEffect, useRef, createContext, ReactNode } from "react";
import { Presence } from "phoenix";
import { useRouter } from "next/router";
import { useAlert } from "components";
import { useAppDispatch, useAppSelector } from "~/utils/redux";
import { useChannel } from "~/utils/channel";
import { gameActions } from "lib/game/gameSlice";
import { localStorage } from "~/utils/window";

export const GameContext = createContext({
  broadcast: (_eventName: string, _payload?: Record<string, any>) => {},
});

type Props = { gameId?: string; children?: ReactNode };

const PRESENCE_EVENTS = {
  state: "presence_state",
  diff: "presence_diff",
};

export const GameProvider = ({ children, gameId }: Props) => {
  const storedGameId = useAppSelector((state) => state.game.gameId);
  const presencesRef = useRef({});
  const router = useRouter();
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const { broadcast, connected, error } = useChannel(
    `game:${gameId}`,
    {
      name: localStorage.getItem("name"),
      isSpectator: router.pathname.includes("spectate"),
    },
    (event, payload = {}) => {
      if (event === PRESENCE_EVENTS.state || event === PRESENCE_EVENTS.diff) {
        if (event === PRESENCE_EVENTS.state) {
          presencesRef.current = payload;
        } else {
          presencesRef.current = Presence.syncDiff(
            presencesRef.current,
            payload as { joins: object; leaves: object }
          );
        }
        const players = Presence.list(presencesRef.current)
          .map((p) => p.metas[0])
          .filter((p) => !p.isSpectator);
        dispatch({ type: "game/players", payload: { players } });
      } else {
        dispatch({ type: event, payload });
      }
    }
  );

  useEffect(() => {
    if (!storedGameId && gameId) {
      dispatch(gameActions.new_game({ gameId }));
    }
    if (error) {
      dispatch(gameActions.reset({ gameId: undefined }));
      alert.show(`Error connecting to game ${gameId}`);
      router.push("/");
    }
  }, [storedGameId, gameId, error]);

  useEffect(() => {
    const inviteUsersFrom = localStorage.getItem("lastGameId");
    if (connected && inviteUsersFrom) {
      broadcast("invite", { game_code: inviteUsersFrom, new_code: gameId });
      dispatch(gameActions.invite({ gameId: undefined }));
    }
  }, [connected]);

  if (!connected) return null;
  return (
    <GameContext.Provider value={{ broadcast }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameChannel = () => {
  return useContext(GameContext);
};
