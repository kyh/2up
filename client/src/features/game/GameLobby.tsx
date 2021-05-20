import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import { Button, Modal, SpriteAnimation } from "components";
import { scaleIn } from "styles/animations";
import { useGameChannel } from "features/game/GameProvider";
import { useGame } from "features/game/gameSlice";
import {
  Player,
  PlayersGrid,
  PlayersRow,
} from "features/game/components/PlayerGrid";

export const GameLobby = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state: gameState } = useGame();
  const { broadcast } = useGameChannel();

  const onClickStart = () => {
    if (gameState.players.length < 2) {
      setIsModalOpen(true);
    } else {
      onStart();
    }
  };

  const onStart = () => {
    broadcast("start", { gameId: gameState.gameId });
  };

  useEffect(() => {
    if (gameState.scene) {
      if (gameState.isHost) {
        history.push(`/game/${gameState.gameId}/spectate`);
      } else {
        history.push(`/game/${gameState.gameId}`);
      }
    }
  }, [gameState.gameId, gameState.scene, gameState.isHost]);

  const players = gameState.players.map((p) => (
    <Player key={p.name} isHost={gameState.isHost} playerName={p.name}>
      {!gameState.isHost && (
        <SpriteAnimation name="bubbleExplosion3" left={-130} top={-35} />
      )}
    </Player>
  ));

  return (
    <LobbyContainer>
      <TitleContainer>
        <h1 className="title">
          {gameState.isHost ? (
            <>
              <div>
                Go to <span className="highlight">playhouse.gg</span>
              </div>
              <div>and enter room code:</div>
            </>
          ) : (
            <div>Waiting for players to join room...</div>
          )}
        </h1>
        <div className="game-id">{gameState.gameId}</div>
      </TitleContainer>
      {gameState.isHost ? (
        <SpectatorPlayersContainer>{players}</SpectatorPlayersContainer>
      ) : (
        <PlayersContainer>{players}</PlayersContainer>
      )}
      {!gameState.isHost ? (
        <>
          <Button className="start-game-button" onClick={onClickStart}>
            Start game
          </Button>
          <Modal
            open={isModalOpen}
            title="Are you sure?"
            onRequestClose={() => setIsModalOpen(false)}
            maxWidth={300}
            closeButton
          >
            <StartModalBody>
              <p>
                This game is only fun with 2 or more players. Invite more by
                sending them to:
              </p>
              <TitleContainer>
                <h3 className="title">
                  <span className="highlight">playhouse.gg</span>
                </h3>
                <h3 className="title">and enter the room code:</h3>
                <div className="game-id">{gameState.gameId}</div>
              </TitleContainer>
              <Button className="start-game-button" onClick={onStart}>
                Start anyways
              </Button>
            </StartModalBody>
          </Modal>
        </>
      ) : (
        <Link className="join-button" to="/join">
          Or join the room on this device
        </Link>
      )}
    </LobbyContainer>
  );
};

const LobbyContainer = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  .start-game-button {
    margin: ${({ theme }) => theme.spacings(10)} auto;
  }
  .join-button {
    display: block;
    text-align: center;
    text-decoration: underline;
    margin-top: auto;
  }
`;

const TitleContainer = styled.div`
  .title {
    margin: 0 0 ${({ theme }) => theme.spacings(5)};
  }
  .highlight {
    color: ${({ theme }) => theme.colors.purple};
  }
  .game-id {
    color: ${({ theme }) => theme.ui.alert.text};
    background: ${({ theme }) => theme.ui.alert.background};
    font-size: 5.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 30px 30px;
    line-height: 1;
    border-radius: 19px 22px 30% 16px / 19px 17px 14px 30px;
    margin-bottom: ${({ theme }) => theme.spacings(5)};
  }
`;

const PlayersContainer = styled(PlayersGrid)`
  .avatar {
    transform: scale(0);
    animation: ${scaleIn} 0.3s ease forwards 0.4s;
  }
`;

const SpectatorPlayersContainer = styled(PlayersRow)``;

const StartModalBody = styled.div`
  p {
    margin: 0 0 ${({ theme }) => theme.spacings(3)};
  }
  .game-id {
    font-size: 2rem;
    padding: ${({ theme }) => theme.spacings(5)};
  }
  .start-game-button {
    width: 100%;
    margin-top: ${({ theme }) => theme.spacings(2)};
  }
`;
