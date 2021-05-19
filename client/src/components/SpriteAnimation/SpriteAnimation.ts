import styled, { css, keyframes } from "styled-components";

const sheets = {
  bubbleExplosion3: {
    // url to spritesheet
    spritesheet: require("./bubble-explosion-03/spritesheet.png").default,
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 17,
    // duration of animation in seconds
    duration: 1,
    // animation-fill-mode property
    loop: "forwards",
    // meta.size.w of spritesheet.json
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

export const SpriteAnimation = styled.div<{
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
