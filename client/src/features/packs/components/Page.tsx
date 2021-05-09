import styled from "styled-components";

export const Page = styled.section<{
  bgImage?: string;
  bgTop?: string;
}>`
  display: grid;
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header"
    "content"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;

  ${({ theme, bgImage, bgTop = "0" }) => theme.media.desktop`
    overflow-x: hidden;
    overflow-y: auto;
    perspective: 5px;
    height: var(--vh, 100vh);

    ${
      bgImage
        ? `
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 120%;
        background-image: url(${bgImage});
        background-repeat: no-repeat;
        background-size: auto;
        background-position: center top;
        transform: translateY(${bgTop}) translateZ(-1px) scale(1.2);
        pointer-events: none;
      }
    `
        : ""
    }
  `}
`;

export const Content = styled.section`
  display: grid;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  grid-area: content;
  padding: ${({ theme }) => `${theme.spacings(10)} ${theme.spacings(5)}`};
`;
