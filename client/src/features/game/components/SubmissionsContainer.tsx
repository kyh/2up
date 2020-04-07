import styled from "styled-components";

export const SubmissionsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  .submission {
    display: inline-flex;
    position: relative;
    flex-direction: column;

    .correct {
      position: absolute;
      left: -20px;
      top: -20px;
      height: 60px;
    }

    > button {
      text-transform: uppercase;
      opacity: 1;
    }

    &.full {
      width: 100%;
      margin-bottom: ${({ theme }) => theme.spacings(2)};
    }
  }

  .endorsement-container {
    display: flex;
    flex-direction: row-reverse;
    transform: translateY(-20px);

    .endorsement {
      display: inline-flex;
      flex-direction: column;
      padding: 10px;
      background: ${({ theme }) => theme.ui.background};
      justify-content: center;
      align-items: center;
      border: 2px solid;
      border-radius: 100%;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;
