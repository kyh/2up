import styled from "styled-components";
import { theme } from "~/styles/theme";
import { fadeIn, bounceExpand, bounceContract } from "~/styles/animations";
import { Link, Button, ButtonLinkNative, Icon } from "~/components";
import { useHostGame } from "~/lib/game/useGameActions";
import { Pack as PackModel } from "@prisma/client";

export const PackSection = styled.section`
  .pack-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 3fr));
    grid-gap: ${theme.spacings(5)};

    ${theme.breakpoints.desktop} {
      &.staggered-pack-items {
        grid-template-columns: repeat(4, 1fr);

        .pack-item:first-child {
          grid-column-start: 1;
          grid-column-end: span 2;
          grid-row-start: 1;
          grid-row-end: span 2;
        }
      }
    }
  }

  .pack-section {
    margin-bottom: ${theme.spacings(5)};
    &.spaced {
      margin-bottom: ${theme.spacings(12)};
    }
  }

  .pack-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: capitalize;
    margin-bottom: ${theme.spacings(6)};

    &.main-header {
      justify-content: center;
      margin-bottom: ${theme.spacings(8)};
    }

    &.mb {
      margin-bottom: ${theme.spacings(8)};
    }

    h1,
    h2 {
      margin: 0;
    }

    .category-link {
      display: inline-block;
      &::after {
        display: inline-block;
        content: "»";
        margin-left: ${theme.spacings(1)};
        transition: transform 0.2s ease;
      }
      &:hover {
        &::after {
          transform: translateX(4px);
        }
      }
    }
  }

  .pack-item {
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid ${theme.ui.borderColorAlternate};
    border-radius: ${theme.ui.borderWavyRadius};
    background-color: ${theme.ui.background};
    min-height: 16rem;
    animation: ${bounceContract} 1s;

    &:hover {
      animation: ${bounceExpand} 1s;
      animation-fill-mode: forwards;
      border-color: ${theme.ui.borderColor};
      .pack-item-play {
        display: block;
      }
    }

    &:active {
      animation: ${bounceContract} 1s;
    }

    .pack-item-link {
      display: block;
      height: 100%;
      padding: ${theme.spacings(5)};
    }

    .pack-item-title {
      margin-bottom: ${theme.spacings(3)};
    }

    .pack-item-description {
      color: ${theme.ui.textGrey};
    }

    .pack-item-play {
      display: none;
      position: absolute;
      right: ${theme.spacings(5)};
      bottom: ${theme.spacings(5)};
      animation: ${fadeIn} 0.3s ease forwards;
      > button {
        padding: ${theme.spacings(2)};
        background-color: ${theme.ui.background};
        border-radius: 100%;
      }
    }

    .pack-item-edit {
      position: absolute;
      left: ${theme.spacings(5)};
      bottom: ${theme.spacings(10)};
    }
  }
`;

export const PackImage = styled.div<{ src?: string | null }>`
  width: 100%;
  height: 160px;
  background-color: #bcc7ff;
  background-image: ${({ src }) => (src ? `url("${src}")` : "none")};
  background-size: cover;
  margin: 0 auto ${theme.spacings(2)};
`;

export type PacksProps = {
  pack: PackModel;
  className?: string;
  containerClassName?: string;
  showPlayButton?: boolean;
  showEditButton?: boolean;
};

export const Pack = ({
  pack,
  className = "",
  showPlayButton = true,
  showEditButton = false,
}: PacksProps) => {
  const { hostGame, isIdle } = useHostGame();

  const play = () => {
    hostGame(pack.id);
  };

  return (
    <div className={`pack-item ${className}`}>
      <Link className="pack-item-link" href={`/packs/${pack.id}`}>
        <h2 className="pack-item-title">{pack.name}</h2>
        <p className="pack-item-description">{pack.description}</p>
      </Link>
      {showPlayButton && (
        <div className="pack-item-play">
          <Button variant="fab" onClick={play} disabled={!isIdle}>
            <Icon icon="play" />
          </Button>
        </div>
      )}
      {showEditButton && (
        <div className="pack-item-edit">
          <ButtonLinkNative href={`/packs/${pack.id}/edit`}>
            Edit Pack
          </ButtonLinkNative>
        </div>
      )}
    </div>
  );
};
