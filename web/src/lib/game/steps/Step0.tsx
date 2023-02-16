import { classed } from "@tw-classed/react"
import { useRouter } from "next/router";
import { Button, Modal, Confetti } from "~/components";
import { PlayerScores } from "./Step3";
import type { StepProps } from "~/lib/game/steps/types";

const Step0Play = ({ gameState }: StepProps) => {
  const router = useRouter();
  const { redirectTo } = router.query;

  const handleEnd = async () => {
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
        playerScores={gameState.playerScores}
      />
      <Footer>
        <Button className="mb-3" onClick={handleEnd} autoFocus>
          Play Again
        </Button>
        <button className="underline" onClick={handleEnd}>
          Leave game
        </button>
      </Footer>
      {/*
      <Modal
        open={!!gameState.invitedToGame}
        onClose={() =>
          dispatch(gameActions.invite({ gameId: undefined }))
        }
        maxWidth={300}
        closeButton
      >
        <h3>Would you like to join your friends in a new game?</h3>
        <InviteModalFooter>
          <button className="underline" onClick={() => handleEnd()}>
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

const Footer = classed.div(
  "absolute mb-20 left-1/2 w-[150px] text-center ml-[-75px]"
);

const InviteModalFooter = classed.div("flex justify-around items-center mt-6");

export const Step0 = Step0Play;
