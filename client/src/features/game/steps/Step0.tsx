import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Button, Modal, Confetti } from "components";
import { theme } from "styles/theme";
import { gameActions, StepProps } from "features/game/gameSlice";
import { PlayerScores } from "./Step3";

export const Step0 = ({ gameState, dispatch }: StepProps) => {
  const history = useHistory();

  const handleEnd = (gameId?: string) => {
    dispatch(gameActions.reset({ gameId }));
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
        onRequestClose={() =>
          dispatch(gameActions.invite({ gameId: undefined }))
        }
        maxWidth={300}
        closeButton
      >
        <h3>Would you like to join your friends in a new game?</h3>
        <InviteModalFooter>
          <Link onClick={() => handleEnd()} to="/packs">
            No thanks
          </Link>
          <Button
            onClick={() => {
              dispatch(
                gameActions.new_game({ gameId: gameState.invitedToGame! })
              );
              dispatch(gameActions.invite({ gameId: undefined }));
              history.push("/join");
            }}
          >
            Join new game
          </Button>
        </InviteModalFooter>
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

const InviteModalFooter = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: ${theme.spacings(6)};
`;

export const Step0Spectate = Step0;
