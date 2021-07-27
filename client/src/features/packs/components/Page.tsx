import styled, { css } from "styled-components";
import { theme } from "styles/theme";

export const Page = styled.section<{
  bgImage?: string;
  bgTop?: string;
}>`
  display: grid;
  background: ${theme.ui.backgroundGrey};
  grid-template-areas:
    "header"
    "content"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
  min-height: 100vh;

  ${theme.breakpoints.desktop} {
    ${({ bgImage, bgTop = "0" }) => css`
      overflow-x: hidden;
      overflow-y: auto;
      perspective: 5px;
      height: 100vh;

      ${bgImage &&
      css`
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 120vh;
          background-image: url(${bgImage});
          background-repeat: no-repeat;
          background-size: auto;
          background-position: center top;
          transform: translateY(${bgTop}) translateZ(-1px) scale(1.2);
          pointer-events: none;
        }
      `}
    `}
  }
`;

export const Content = styled.main`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  grid-area: content;
  padding: ${theme.spacings(5)} ${theme.spacings(3)};

  .back-link {
    display: inline-block;
    margin-bottom: ${theme.spacings(1)};
    &:hover {
      text-decoration: underline;
    }
  }

  ${theme.breakpoints.desktop} {
    padding: ${theme.spacings(10)} ${theme.spacings(5)};
  }
`;

export const Footer = styled.footer`
  grid-area: footer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacings(5)} 0 ${theme.spacings(20)};
  background-image: url("/illustrations/rainbow.svg");
  background-repeat: no-repeat;
  background-size: 300px;
  background-position: center -30px;

  a {
    text-decoration: underline;
  }
`;
