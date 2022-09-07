import styled from "styled-components";
import { useRouter } from "next/router";
import { Button, Modal, Confetti } from "~/components";
import { theme } from "~/styles/theme";
import { PlayerScores } from "./Step3";
import { useEndGame } from "~/lib/game/useGameActions";
import type { StepProps } from "~/lib/game/steps/types";

const Step0Play = ({ gameState, playerScores }: StepProps) => {
  const router = useRouter();
  const { endGame } = useEndGame();
  const { gameId, redirectTo } = router.query;

  const handleEnd = async () => {
    await endGame(gameId as string);
    if (redirectTo) {
      router.push(`/packs/${redirectTo}/edit`);
    } else {
      router.push("/packs");
    }
  };

  return (
    <>
      <Confetti />
      <PlayerScores
        title="Game Finished"
        gameState={gameState}
        players={playerScores}
      />
      <Footer>
        <Button className="play-again" onClick={handleEnd} autoFocus>
          Play Again
        </Button>
        <button className="link" onClick={handleEnd}>
          Leave game
        </button>
      </Footer>
      {/*
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
              router.push(`/?code=${gameState.invitedToGame!}&join=true`);
            }}
          >
            Join new game
          </Button>
        </InviteModalFooter>
      </Modal> */}
    </>
  );
};

const Footer = styled.div`
  position: absolute;
  bottom: ${theme.spacings(20)};
  left: 50%;
  width: 150px;
  text-align: center;
  margin-left: -75px;

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

export const Step0 = Step0Play;
