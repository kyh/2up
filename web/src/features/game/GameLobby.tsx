import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAlert } from "react-alert";
import { Link, Button, Modal, AnimationSprite, Icon } from "components";
import { theme } from "styles/theme";
import { bounceIn } from "styles/animations";
import { useAppSelector } from "util/redux";
import { useGameChannel } from "features/game/GameProvider";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "features/game/components/PlayerGrid";
import { location } from "util/window";

export const GameLobby = ({ isSpectate }: { isSpectate?: boolean }) => {
  const alert = useAlert();
  const router = useRouter();
  const gameState = useAppSelector((state) => state.game);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { broadcast } = useGameChannel();
  const gameLink = `${location.origin}?gameId=${gameState.gameId}`;

  const onClickStart = () => {
    // Adopt single player mode for now...
    // if (gameState.players.length < 2) {
    //   setIsModalOpen(true);
    // } else {
    //   onStart();
    // }
    onStart();
  };

  const onStart = () => {
    broadcast("start", { gameId: gameState.gameId });
  };

  const onShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join my Playhouse game",
          url: gameLink,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(gameLink);
      alert.show("Copied Link");
    }
  };

  useEffect(() => {
    if (gameState.scene) {
      router.push(
        `/game/${gameState.gameId}${isSpectate ? "/spectate" : ""}${
          location.search
        }`
      );
    }
  }, [gameState.gameId, gameState.scene]);

  return (
    <>
      <TitleContainer>
        <h1 className="title">
          <div>
            Invite friends to{" "}
            <button type="button" onClick={onShare} className="highlight">
              playhouse.gg <ShareIcon icon="share" size="md" />
            </button>
          </div>
          <div>and enter room code:</div>
        </h1>
        <div className="game-id">{gameState.gameId}</div>
      </TitleContainer>
      <PlayersContainer>
        {gameState.players.map((p) => (
          <Player key={p.name} playerName={p.name}>
            <Explosion name="bubbleExplosion3" />
          </Player>
        ))}
      </PlayersContainer>
      {!isSpectate ? (
        <>
          <NextButton onClick={onClickStart}>Start game</NextButton>
          <Modal
            open={isModalOpen}
            title="Are you sure?"
            onRequestClose={() => setIsModalOpen(false)}
            maxWidth={300}
            closeButton
          >
            <StartModalBody>
              <TitleContainer>
                <p>This game is only fun with 2 or more players.</p>
                <p>
                  <span className="block">
                    Invite friends to{" "}
                    <span className="highlight">playhouse.gg</span>
                  </span>
                  <span className="block">and enter the room code:</span>
                </p>
                <div className="game-id">{gameState.gameId}</div>
              </TitleContainer>
              <Button fullWidth onClick={onStart}>
                Start anyways
              </Button>
            </StartModalBody>
          </Modal>
        </>
      ) : (
        <JoinRoomButton to="/game_name">
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
