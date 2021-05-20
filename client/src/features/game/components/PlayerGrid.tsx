import styled from "styled-components";
import { Avatar } from "components";

type PlayerProps = {
  isHost: boolean;
  playerName: string;
  children: React.ReactNode;
};

export const Player = ({
  isHost,
  playerName,
  children,
  ...rest
}: PlayerProps) => {
  return (
    <PlayerContainer className="player" {...rest}>
      <Avatar className="avatar" name={playerName} contain={!isHost} />
      <PlayerName className="name">{playerName}</PlayerName>
      {children}
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const PlayerName = styled.p`
  margin-top: ${({ theme }) => theme.spacings(1)};
  margin-bottom: 0;
`;

export const PlayersGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${({ theme }) => theme.spacings(3)};
`;

export const PlayersRow = styled.section`
  position: absolute;
  display: flex;
  justify-content: space-between;
  left: ${({ theme }) => theme.spacings(8)};
  right: ${({ theme }) => theme.spacings(8)};
  bottom: 0;
  pointer-events: none;
  .player {
    text-align: center;
    overflow: hidden;
    align-self: flex-end;
    flex-direction: column-reverse;
    .name {
      margin-bottom: ${({ theme }) => theme.spacings(1)};
    }
    .avatar {
      margin-right: ${({ theme }) => theme.spacings(2)};
      max-width: 130px;
      max-height: 300px;
    }
  }
`;
