import { Box } from "reflexbox";
import styled, { css, keyframes } from "styled-components";

const sheets = {
  bubbleExplosion3: {
    spritesheet: require("./bubble-explosion-03/spritesheet.png").default,
    width: 360,
    height: 185,
    steps: 17,
    duration: 1,
    loop: "forwards",
    animation: keyframes`
      100% { background-position: -6120px 0; }
    `,
  },
};

type animationName = keyof typeof sheets;

export const animate = (name: animationName) => {
  const sprite = sheets[name];
  return css`
    position: absolute;
    pointer-events: none;
    width: ${sprite.width}px;
    height: ${sprite.height}px;
    background: transparent url(${sprite.spritesheet}) 0 0 no-repeat;
    animation: ${sprite.animation} ${sprite.duration}s steps(${sprite.steps})
      ${sprite.loop};
  `;
};

export const SpriteAnimation = styled(Box)<{
  name: animationName;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}>`
  ${({ name }) => animate(name)};
  top: ${({ top }) => `${top}px` || "auto"};
  left: ${({ left }) => `${left}px` || "auto"};
  right: ${({ right }) => `${right}px` || "auto"};
  bottom: ${({ bottom }) => `${bottom}px` || "auto"};
`;
