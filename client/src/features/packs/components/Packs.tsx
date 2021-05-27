import styled from "styled-components";
import { theme } from "styles/theme";

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
    margin-bottom: ${theme.spacings(12)};
  }

  .pack-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(6)};

    &.main-header {
      justify-content: center;
    }
  }

  .pack-item {
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid ${theme.ui.borderColorAlternate};
    border-radius: ${theme.ui.borderWavyRadius};
    background-color: ${theme.ui.background};
    min-height: 16em;

    &:hover {
      border-color: ${theme.ui.borderColor};
    }

    article {
      padding: ${theme.spacings(5)};
    }

    h2 {
      margin-bottom: ${theme.spacings(3)};
    }

    p {
      color: ${theme.ui.textGrey};
    }

    .edit-pack-footer {
      margin: ${`auto ${theme.spacings(5)} ${theme.spacings(5)}`};
      a {
        display: inline-flex;
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
  margin: ${`0 auto ${theme.spacings(2)}`};
`;
