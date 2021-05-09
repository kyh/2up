import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { AvatarImage, Button, Modal } from "components";
import { hashCode } from "utils/stringUtils";
import { useGameChannel } from "features/game/GameChannel";

export const GameLobby = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state: gameState, broadcast } = useGameChannel();

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
      if (gameState.isSpectator) {
        history.push(`/game/${gameState.gameId}/spectate`);
      } else {
        history.push(`/game/${gameState.gameId}`);
      }
    }
  }, [gameState.gameId, gameState.scene, gameState.isSpectator]);

  return (
    <LobbyContainer>
      {gameState.isSpectator ? (
        <TitleContainer>
          <h1 className="title">
            Go to <span className="highlight">playhouse.gg</span>
          </h1>
          <h1 className="title">and enter the room code:</h1>
          <div className="game-id">{gameState.gameId}</div>
        </TitleContainer>
      ) : (
        <h1 className="title">Waiting for players to join...</h1>
      )}
      <LobbyPlayersContainer isSpectator={gameState.isSpectator}>
        {gameState.players.map((p) => {
          const avatar = hashCode(p.name, 10);
          return (
            <div className="player" key={p.name}>
              <p>{p.name}</p>
              <AvatarImage avatar={avatar} />
            </div>
          );
        })}
      </LobbyPlayersContainer>
      {!gameState.isSpectator ? (
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
    margin: ${({ theme }) => theme.spacings(4)} auto;
  }
  .join-button {
    display: block;
    text-align: center;
    text-decoration: underline;
    margin-top: auto;
  }
`;
const TitleContainer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacings(2)};

  .title {
    margin: 0 0 ${({ theme }) => theme.spacings(2)};
  }
  .highlight {
    color: ${({ theme }) => theme.colors.purple};
  }
  .game-id {
    color: ${({ theme }) => theme.ui.alert.text};
    background: ${({ theme }) => theme.ui.alert.background};
    font-size: 7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 30px 30px;
    line-height: 1;
    border-radius: 19px 22px 30% 16px / 19px 17px 14px 30px;
  }
`;

type LobbyPlayersContainerProps = {
  isSpectator: boolean;
};
const renderTvStyles = () => {
  return css`
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: ${({ theme }) => theme.spacings(8)};
    right: ${({ theme }) => theme.spacings(8)};
    bottom: 10%;

    .player {
      text-align: center;
      svg {
        width: 70%;
      }
    }
  `;
};
const renderRemoteStyles = () => {
  return css`
    margin-top: ${({ theme }) => theme.spacings(4)};
    .player {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      margin-bottom: ${({ theme }) => theme.spacings(2)};

      p {
        margin-right: auto;
      }

      svg {
        max-height: 50px;
        margin-right: ${({ theme }) => theme.spacings(2)};
      }
    }
  `;
};
const LobbyPlayersContainer = styled.section<LobbyPlayersContainerProps>`
  ${({ isSpectator }) =>
    isSpectator ? renderTvStyles() : renderRemoteStyles()}
`;
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
