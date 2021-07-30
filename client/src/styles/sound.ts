import UIfx from "uifx";

const publicUrl = process.env.NEXT_PUBLIC_APP_URL;

const soundMap = {
  click: `${publicUrl}/sounds/click.mp3`,
  doorbell: `${publicUrl}/sounds/doorbell.mp3`,
  pop: `${publicUrl}/sounds/pop.mp3`,
  slap: `${publicUrl}/sounds/slap.mp3`,
  bike: `${publicUrl}/sounds/bike.mp3`,
  theme: `${publicUrl}/sounds/theme.mp3`,
};

const fx: Record<string, any> = {};

export const createOrGetFx = (soundName: keyof typeof soundMap) => {
  if (typeof window === "undefined") return;
  if (!fx[soundName]) {
    fx[soundName] = new UIfx(soundMap[soundName]);
  }
  return fx[soundName];
};

export const createOrGetThemesong = () => {
  if (typeof window === "undefined") return;
  if (!fx.theme) {
    fx.theme = new Audio(soundMap.theme);
    fx.theme.addEventListener("canplaythrough", () => {
      fx.theme.loop = true;
    });
  }
  return fx.theme;
};
