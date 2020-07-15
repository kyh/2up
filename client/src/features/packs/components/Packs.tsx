import styled from "styled-components";

export const PackSection = styled.section`
  .pack-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 3fr));
    grid-gap: ${({ theme }) => theme.spacings(5)};
  }

  .pack-section {
    margin-bottom: ${({ theme }) => theme.spacings(8)};
  }

  .pack-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pack-item {
    position: relative;
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    ${({ theme }) => theme.media.desktop`
      max-width: 273px;
    `}

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
    }

    a {
      display: block;
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
      margin-top: ${({ theme }) => theme.spacings(5)};

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
