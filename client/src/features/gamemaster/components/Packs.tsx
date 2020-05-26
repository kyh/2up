import styled from "styled-components";

export const PackSection = styled.section`
  .pack-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 3fr));
    grid-gap: ${({ theme }) => theme.spacings(5)};
  }

  .pack-item {
    position: relative;
    padding: ${({ theme }) => theme.spacings(5)};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
    }

    img {
      display: block;
      width: 100%;
      height: 160px;
      object-fit: cover;
      margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
    }

    h4 {
      margin-bottom: ${({ theme }) => theme.spacings(3)};
    }

    p {
      color: ${({ theme }) => theme.ui.lightText};
    }

    .edit-pack-button {
      position: absolute;
      right: ${({ theme }) => theme.spacings(3)};
      bottom: ${({ theme }) => theme.spacings(3)};
      padding: ${({ theme }) => theme.spacings(1)};
      border-radius: ${({ theme }) => theme.border.wavyRadius};
      border: 2px solid ${({ theme }) => theme.border.color};

      &:hover {
        border-color: ${({ theme }) => theme.border.alternateColor};
      }
    }
  }
`;

export const DefaultImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #bcc7ff;
  margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
`;
