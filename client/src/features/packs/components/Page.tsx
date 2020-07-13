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

export const Content = styled.section<{
  bgImage?: string;
  bgHeight?: string;
  bgTop?: string;
}>`
  display: grid;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  grid-area: content;
  padding: ${({ theme }) => `${theme.spacings(10)} ${theme.spacings(5)}`};

  &::before {
    ${({ bgImage, bgHeight = "100%", bgTop = "0" }) =>
      bgImage
        ? `
    content: '';
    position: absolute;
    width: 100%;
    max-width: 100%;
    height: ${bgHeight};
    background-image: url(${bgImage});
    background-repeat: no-repeat;
    background-size: auto;
    left: 50%;
    top: ${bgTop};
    background-position: center top;
    transform: translate(-50%);
    pointer-events: none;
  `
        : ""}
  }
`;
