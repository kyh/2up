import UIfx from "uifx";

const soundMap = {
  click: `/sounds/click.mp3`,
  doorbell: `/sounds/doorbell.mp3`,
  pop: `/sounds/pop.mp3`,
  slap: `/sounds/slap.mp3`,
  bike: `/sounds/bike.mp3`,
  theme: `/sounds/theme.mp3`,
};

const fx: Record<string, any> = {};

export const createOrGetFx = (soundName: keyof typeof soundMap) => {
  if (typeof window === "undefined") return;
  if (!fx[soundName]) {
    fx[soundName] = new UIfx(soundMap[soundName]);
  }
  return fx[soundName];
};

export const createOrGetThemesong = (autoplay?: boolean) => {
  if (typeof window === "undefined") return;
  if (!fx.theme) {
    fx.theme = new Audio(soundMap.theme);
    fx.theme.addEventListener("canplaythrough", () => {
      fx.theme.loop = true;
      if (autoplay) fx.theme.play();
    });
  }
  return fx.theme;
};
