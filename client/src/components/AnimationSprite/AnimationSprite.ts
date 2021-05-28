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

type AnimationNames = keyof typeof sheets;

export const animateSprite = (name: AnimationNames) => {
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

type Props = {
  name: AnimationNames;
};

export const AnimationSprite = styled.div<Props>`
  ${({ name }) => animateSprite(name)};
`;