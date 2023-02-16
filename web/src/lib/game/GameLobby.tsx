import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { classed } from "@tw-classed/react";
import {
  Link,
  Button,
  Modal,
  AnimationSprite,
  Icon,
  useAlert,
} from "~/components";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "~/lib/game/components/PlayerGrid";
import { useGameStore } from "~/lib/game/gameStore";
import { useStartGame } from "~/lib/game/useGameActions";

export const GameLobby = ({ isSpectate }: { isSpectate?: boolean }) => {
  const alert = useAlert();
  const router = useRouter();
  const { startGame, isLoading } = useStartGame();
  const gameState = useGameStore((state) => state.state);
  const players = useGameStore((state) => state.players);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gameId = router.query.gameId as string;

  const onClickStart = () => {
    // Adopt single player mode for now...
    // if (gameState.players.length < 2) {
    //   setIsModalOpen(true);
    // } else {
    //   onStart();
    // }
    onStart();
  };

  const onStart = async () => {
    await startGame(gameId);
  };

  const onShare = () => {
    const gameLink = `${location.origin}?gameId=${gameId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Join my Truffles game",
          url: gameLink,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(gameLink);
      alert.show("Copied Link");
    }
  };

  useEffect(() => {
    if (gameState.currentStep !== 0) {
      router.push({
        pathname: `/game/${gameId}${isSpectate ? "/spectate" : ""}`,
        query: { returnTo: router.query.returnTo },
      });
    }
  }, [gameState, gameState.currentStep]);

  return (
    <>
      <TitleContainer>

        {/* Title */}
        <h1 className="mb-5">
          <div>
            Invite friends to{" "}
            <button type="button" onClick={onShare} className="highlight">
              truffles.tv <ShareIcon icon="share" size="md" />
            </button>
          </div>
          <div>and enter room code:</div>
        </h1>
        <GameId>{gameId}</GameId>
      </TitleContainer>
      <PlayersContainer>
        {players.map((p) => (
          <Player key={p.userId} playerName={p.name}>
            <Explosion name="bubbleExplosion3" />
          </Player>
        ))}
      </PlayersContainer>
      {!isSpectate ? (
        <>
          <NextButton onClick={onClickStart} disabled={isLoading}>
            Start game
          </NextButton>
          <Modal
            open={isModalOpen}
            title="Are you sure?"
            onClose={() => setIsModalOpen(false)}
            maxWidth={300}
            closeButton
          >
            <div>
              <TitleContainer>
                <StartModalPTag>This game is only fun with 2 or more players.</StartModalPTag>
                <StartModalPTag>
                  <span className="block">
                    Invite friends to{" "}
                    <span className="text-purple">truffles.tv</span>
                  </span>
                  <span className="block">and enter the room code:</span>
                </StartModalPTag>
                <div className="text-[2rem] p-5">{gameId}</div>
              </TitleContainer>
              <Button fullWidth onClick={onStart} disabled={isLoading}>
                Start anyways
              </Button>
            </div>
          </Modal>
        </>
      ) : (
        <JoinRoomButton href={`/?gameId=${gameId}&join=true`}>
          Or join the room on this device
        </JoinRoomButton>
      )}
    </>
  );
};

const JoinRoomButton = classed(Link, "block text-center underline mt-auto");
const GameId = classed.div(
  "text-white dark:text-black bg-black dark:bg-white text-[5.5rem]",
  "flex justify-center items-center pt-5 pb-[30px] px-[30px] leading-none",
  "rounded-[19px_22px_30%_16px_/_19px_17px_14px_30px] mb-5"
);
const TitleContainer = classed.div("pt-[50px]");

const ShareIcon = classed(Icon, "relative left-[-10px]");

const PlayersContainer = classed(
  PlayersGrid,
  "[&_.avatar]:scale-0 [&_.avatar]:animate-[bounceIn_1s_linear_forwards_0.4s]"
);

const Explosion = classed(AnimationSprite, "top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2");

const StartModalPTag = classed.p("mb-3");
