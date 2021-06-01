import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Button, Modal, Confetti } from "components";
import { theme } from "styles/theme";
import { gameActions, StepProps } from "features/game/gameSlice";
import { PlayerScores } from "./Step3";

export const Step0 = ({ gameState, broadcast, dispatch }: StepProps) => {
  const history = useHistory();

  const handleEnd = (gameId?: string) => {
    dispatch(gameActions.reset({ gameId }));
    broadcast("end");
    history.push("/packs");
  };

  return (
    <>
      <Confetti />
      <PlayerScores title="Game Finished" gameState={gameState} />
      <Footer>
        <Button onClick={() => handleEnd(gameState.gameId)} autoFocus>
          Play Again
        </Button>
        <Link onClick={() => handleEnd()} to="/packs">
          Leave game
        </Link>
      </Footer>
      <Modal
        open={!!gameState.invitedToGame}
        title="Would you like to join your friends in a new game?"
        onRequestClose={() =>
          dispatch(gameActions.invite({ gameId: undefined }))
        }
        maxWidth={500}
        closeButton
      >
        <Button>Join new game</Button>
      </Modal>
    </>
  );
};

const Footer = styled.div`
  margin: auto auto ${theme.spacings(10)};
  display: flex;
  flex-direction: column;
  align-items: center;

  > button {
    margin-bottom: ${theme.spacings(3)};
  }

  > a {
    text-decoration: underline;
  }
`;

export const Step0Spectate = Step0;
