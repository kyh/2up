import { classed } from "@/lib/utils/classed";

// Delay and duration can be modified by tw-classes
export const AnimationSprite = classed.div(
  "absolute pointer-events-none bg-transparent bg-no-repeat w-sprite h-sprite",
  {
    variants: {
      name: {
        bubbleExplosion3: "bg-bubble-explosion-3 animate-bubble-explosion-3",
        blinkingStars2: "bg-blinking-stars-2 animate-blinking-stars-2",
        arrow1: "bg-arrow-1 animate-arrow-1",
        wineGlassClinking: "bg-wine-glass-clinking animate-wine-glass-clinking",
        crossMark: "bg-cross-mark animate-cross-mark",
        checkMark: "bg-check-mark animate-check-mark",
        bubbleEmpty: "bg-bubble-empty animate-bubble-empty",
        bubbleDislike: "bg-bubble-dislike animate-bubble-dislike",
        bubbleCryEmoji: "bg-bubble-cry-emoji animate-bubble-cry-emoji",
        bubbleLike: "bg-bubble-like animate-bubble-like",
      },
    },
  },
);
