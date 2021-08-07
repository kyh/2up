import styled, { css, keyframes } from "styled-components";

const sheets = {
  bubbleExplosion3: {
    // url to spritesheet
    spritesheet: "/sprites/bubble-explosion-03/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 17,
    // duration of animation in seconds
    duration: 1,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -6120px 0; }
    `,
  },
  blinkingStars2: {
    // url to spritesheet
    spritesheet: "/sprites/blinking-stars-02/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 29,
    // duration of animation in seconds
    duration: 1.2,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "infinite",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -10440px 0; }
    `,
  },
  arrow1: {
    // url to spritesheet
    spritesheet: "/sprites/arrow-1/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 23,
    // duration of animation in seconds
    duration: 1,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -8280px 0; }
    `,
  },
  wineGlassClinking: {
    // url to spritesheet
    spritesheet: "/sprites/wine-glass-clinking/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 50,
    // duration of animation in seconds
    duration: 1.5,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -18000px 0; }
    `,
  },
  crossMark: {
    // url to spritesheet
    spritesheet: "/sprites/cross-mark/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 44,
    // duration of animation in seconds
    duration: 1.4,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -15840px 0; }
    `,
  },
  checkMark: {
    // url to spritesheet
    spritesheet: "/sprites/check-mark/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 37,
    // duration of animation in seconds
    duration: 1.3,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -13320px 0; }
    `,
  },
  bubbleEmpty: {
    // url to spritesheet
    spritesheet: "/sprites/bubble-empty/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 53,
    // duration of animation in seconds
    duration: 1.5,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -19080px 0; }
    `,
  },
  bubbleDislike: {
    // url to spritesheet
    spritesheet: "/sprites/bubble-dislike/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 49,
    // duration of animation in seconds
    duration: 1.5,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -17640px 0; }
    `,
  },
  bubbleCryEmoji: {
    // url to spritesheet
    spritesheet: "/sprites/bubble-cry-emoji/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 49,
    // duration of animation in seconds
    duration: 1.5,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -17640px 0; }
    `,
  },
  bubbleLike: {
    // url to spritesheet
    spritesheet: "/sprites/bubble-like/spritesheet.png",
    // frame width
    width: 360,
    // frame height
    height: 185,
    // number of frames
    steps: 49,
    // duration of animation in seconds
    duration: 1.5,
    // animation-fill-mode property
    animationFillMode: "forwards",
    // animation-interation-count property
    animationIterationCount: "1",
    // meta.size.w of spritesheet.json
    animation: keyframes`
      100% { background-position: -17640px 0; }
    `,
  },
};

type AnimationNames = keyof typeof sheets;

export const animateSprite = (
  name: AnimationNames,
  duration = 0,
  delay = 0
) => {
  const sprite = sheets[name];
  return css`
    position: absolute;
    pointer-events: none;
    width: ${sprite.width}px;
    height: ${sprite.height}px;
    background: transparent url("${sprite.spritesheet}") 0 0 no-repeat;
    animation: ${sprite.animation} ${duration || sprite.duration}s
      steps(${sprite.steps}) ${delay}s ${sprite.animationIterationCount}
      ${sprite.animationFillMode};
  `;
};

type Props = {
  name: AnimationNames;
  duration?: number;
  delay?: number;
};

export const AnimationSprite = styled.div<Props>`
  ${({ name, duration, delay }) => animateSprite(name, duration, delay)};
`;
