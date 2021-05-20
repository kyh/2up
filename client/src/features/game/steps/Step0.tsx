import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button } from "components";
import { visible } from "styles/animations";
import { gameActions, StepProps } from "features/game/gameSlice";

export const Step0 = ({ gameState, broadcast, dispatch }: StepProps) => {
  const history = useHistory();
  const handleEnd = () => {
    dispatch(gameActions.reset());
    broadcast("end");
    history.push("/");
  };

  return (
    <Container>
      <h2>Game Finished</h2>
      {gameState.players.map((player) => (
        <div key={player.name}>
          <h3>{player.name}</h3>
          <h4>{player.score}</h4>
        </div>
      ))}
      <Button onClick={handleEnd}>Lobby</Button>
    </Container>
  );
};

const Container = styled.div`
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;
`;

export const Step0Spectate = Step0;
