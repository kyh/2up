import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Link,
  Button,
  Modal,
  AnimationSprite,
  Icon,
  useAlert,
} from "~/components";
import { theme } from "~/styles/theme";
import { bounceIn } from "~/styles/animations";
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
  const { startGame, isIdle } = useStartGame();
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
          title: "Join my Trifles game",
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
        <h1 className="title">
          <div>
            Invite friends to{" "}
            <button type="button" onClick={onShare} className="highlight">
              trifles.tv <ShareIcon icon="share" size="md" />
            </button>
          </div>
          <div>and enter room code:</div>
        </h1>
        <div className="game-id">{gameId}</div>
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
          <NextButton onClick={onClickStart} disabled={!isIdle}>
            Start game
          </NextButton>
          <Modal
            open={isModalOpen}
            title="Are you sure?"
            onClose={() => setIsModalOpen(false)}
            maxWidth={300}
            closeButton
          >
            <StartModalBody>
              <TitleContainer>
                <p>This game is only fun with 2 or more players.</p>
                <p>
                  <span className="block">
                    Invite friends to{" "}
                    <span className="highlight">trifles.tv</span>
                  </span>
                  <span className="block">and enter the room code:</span>
                </p>
                <div className="game-id">{gameId}</div>
              </TitleContainer>
              <Button fullWidth onClick={onStart} disabled={!isIdle}>
                Start anyways
              </Button>
            </StartModalBody>
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

const JoinRoomButton = styled(Link)`
  display: block;
  text-align: center;
  text-decoration: underline;
  margin-top: auto;
`;

const TitleContainer = styled.div`
  padding-top: 50px;

  .title {
    margin: 0 0 ${theme.spacings(5)};
  }

  .block {
    display: block;
  }

  .highlight {
    color: ${theme.colors.purple};
  }

  .game-id {
    color: ${theme.ui.alertText};
    background: ${theme.ui.alertBackground};
    font-size: 5.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 30px 30px;
    line-height: 1;
    border-radius: 19px 22px 30% 16px / 19px 17px 14px 30px;
    margin-bottom: ${theme.spacings(5)};
  }
`;

const ShareIcon = styled(Icon)`
  position: relative;
  left: -10px;
`;

const PlayersContainer = styled(PlayersGrid)`
  .avatar {
    transform: scale(0);
    animation: ${bounceIn} 1s linear forwards 0.4s;
  }
`;

const Explosion = styled(AnimationSprite)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StartModalBody = styled.div`
  p {
    margin: 0 0 ${theme.spacings(3)};
  }

  .game-id {
    font-size: 2rem;
    padding: ${theme.spacings(5)};
  }
`;
