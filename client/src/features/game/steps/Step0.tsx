import styled from "styled-components";
import { useRouter } from "next/router";
import { Button, Modal, Confetti } from "components";
import { theme } from "styles/theme";
import { gameActions, StepProps } from "features/game/gameSlice";
import { PlayerScores } from "./Step3";

export const Step0 = ({ gameState, dispatch }: StepProps) => {
  const router = useRouter();
  const { test } = router.query;

  const handleEnd = (gameId?: string) => {
    dispatch(gameActions.reset({ gameId }));
    if (test) {
      router.push(`/packs/${test}/edit`);
    } else {
      router.push("/packs");
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
          <button className="link" onClick={() => handleEnd()}>
            No thanks
          </button>
          <Button
            onClick={() => {
              dispatch(
                gameActions.new_game({ gameId: gameState.invitedToGame! })
              );
              dispatch(gameActions.invite({ gameId: undefined }));
              router.push("/join");
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
