import styled from "styled-components";

export const PackSection = styled.section`
  .pack-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 3fr));
    grid-gap: ${({ theme }) => theme.spacings(5)};

    ${({ theme }) => theme.media.desktop`
      &.staggered-pack-items {
        grid-template-columns: repeat(4, 1fr);

        .pack-item:first-child {
          grid-column-start: 1;
          grid-column-end: span 2;
          grid-row-start: 1;
          grid-row-end: span 2;
        }
      }
    `}
  }

  .pack-section {
    margin-bottom: ${({ theme }) => theme.spacings(12)};
  }

  .pack-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacings(6)};

    &.main-header {
      justify-content: center;
    }
  }

  .pack-item {
    position: relative;
    border: 2px solid ${({ theme }) => theme.border.alternateColor};
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    background-color: ${({ theme }) => theme.ui.background};

    &:hover {
      border-color: ${({ theme }) => theme.border.color};
    }

    article {
      padding: ${({ theme }) => theme.spacings(5)};
    }

    h4 {
      margin-bottom: ${({ theme }) => theme.spacings(3)};
    }

    p {
      color: ${({ theme }) => theme.ui.lightText};
    }

    .edit-pack-footer {
      display: flex;
      justify-content: center;
      margin-bottom: ${({ theme }) => theme.spacings(5)};

      a {
        padding: ${({ theme }) => theme.spacings(3)};
      }
    }

    .pack-play-button {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
      &:active {
        transform: translateX(-50%) scale(0.9);
      }
    }
  }
`;

export const PackImage = styled.div<{ src?: string | null }>`
  width: 100%;
  height: 160px;
  background-color: #bcc7ff;
  background-image: ${({ src }) => (src ? `url("${src}")` : "none")};
  background-size: cover;
  margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
`;
