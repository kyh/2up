import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Button, ButtonLink, Modal, Confetti } from "components";
import { theme } from "styles/theme";
import { gameActions, StepProps } from "features/game/gameSlice";
import { useQueryParams } from "util/query";
import { PlayerScores } from "./Step3";

export const Step0 = ({ gameState, dispatch }: StepProps) => {
  const queryParams = useQueryParams();
  const history = useHistory();

  const handleEnd = (gameId?: string) => {
    const testingPack = queryParams.get("test");
    dispatch(gameActions.reset({ gameId }));
    if (testingPack) {
      history.push(`/packs/${testingPack}/edit`);
    } else {
      history.push("/packs");
    }
  };

  return (
    <>
      <Confetti />
      <PlayerScores title="Game Finished" gameState={gameState} />
      <Footer>
        <Button
          className="play-again"
          onClick={() => handleEnd(gameState.gameId)}
          autoFocus
        >
          Play Again
        </Button>
        <button className="link" onClick={() => handleEnd()}>
          Leave game
        </button>
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
  > .play-again {
    margin-bottom: ${theme.spacings(3)};
  }
  > .link {
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
