import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components";
import { gameActions, StepProps } from "features/game/gameSlice";

export const Step0Remote = ({
  state,
  broadcast,
  dispatch = () => {},
}: StepProps) => {
  const history = useHistory();
  const handleEnd = () => {
    dispatch(gameActions.reset());
    broadcast("end");
    history.push("/");
  };

  return (
    <div>
      <h2>Game Finished</h2>
      {state.players.map((player) => (
        <div key={player.name}>
          <h3>{player.name}</h3>
          <h4>{player.score}</h4>
        </div>
      ))}
      <Button onClick={handleEnd}>Lobby</Button>
    </div>
  );
};

export const Step0TV = Step0Remote;
