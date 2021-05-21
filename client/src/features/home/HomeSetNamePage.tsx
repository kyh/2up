import { useState, SyntheticEvent } from "react";
import { useHistory } from "react-router-dom";
import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { useGame } from "features/game/gameSlice";
import { Button, Input } from "components";
import { Form } from "features/home/components/Form";

export const HomeSetNamePage = () => {
  const history = useHistory();
  const { state: playhouseState, dispatch } = usePlayhouse();
  const { state: gameState } = useGame();
  const [name, setName] = useState(playhouseState.name);

  const onSubmitName = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(playhouseActions.update_user({ name }));
    if (gameState.gameId) {
      history.push(`/game/${gameState.gameId}/lobby`);
    } else {
      history.push(`/`);
    }
  };

  return (
    <Form onSubmit={onSubmitName}>
      <Input
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={!name}>
        Join Game
      </Button>
    </Form>
  );
};
