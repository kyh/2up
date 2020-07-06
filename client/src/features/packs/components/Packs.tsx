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

  .pack-item {
    position: relative;
    padding: ${({ theme }) => theme.spacings(5)};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    max-width: 273px;

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
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
