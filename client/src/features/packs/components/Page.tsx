import styled from "styled-components";

export const Page = styled.section`
  display: grid;
  min-height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header"
    "content"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
`;

export const Content = styled.section`
  display: grid;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  grid-area: content;
  padding: ${({ theme }) => `${theme.spacings(10)} ${theme.spacings(5)}`};
`;
