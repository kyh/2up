import { ReactNode } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import { jitter } from "styles/animations";
import { Avatar, Button } from "components";

type PlayerProps = {
  playerName: string;
  playerContent?: ReactNode;
  children?: ReactNode;
};

export const Player = ({
  playerName,
  playerContent,
  children,
  ...rest
}: PlayerProps) => {
  return (
    <PlayerContainer className="player" {...rest}>
      <Avatar className="avatar" name={playerName} />
      <PlayerName className="name">
        {playerName}
        {playerContent}
      </PlayerName>
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
  margin-top: ${theme.spacings(1)};
  margin-bottom: 0;
`;

export const PlayersGrid = styled.section<{
  singleCol?: boolean;
  maxWidth?: number;
}>`
  display: grid;
  grid-template-columns: ${({ singleCol }) =>
    singleCol ? "1fr" : "1fr 1fr 1fr"};
  grid-gap: ${theme.spacings(3)};
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "auto")};
  .avatar > svg {
    animation: ${jitter} 0.7s linear infinite;
  }

  ${theme.breakpoints.desktop} {
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: ${theme.spacings(8)};
    right: ${theme.spacings(8)};
    bottom: 0;
    pointer-events: none;
    .player {
      text-align: center;
      overflow: hidden;
      align-self: flex-end;
      flex-direction: column-reverse;
      .name {
        margin-bottom: ${theme.spacings(1)};
      }
      .avatar {
        margin-right: ${theme.spacings(2)};
        max-width: 130px;
        max-height: 300px;
      }
      .correct {
        top: auto;
        left: auto;
        bottom: -10px;
      }
    }
  }
`;

export const NextButton = styled(Button)`
  margin: auto auto ${theme.spacings(10)};
`;
