import UIfx from "uifx";

const publicUrl = process.env.PUBLIC_URL;

const SoundMap = {
  click: `${publicUrl}/sounds/click.mp3`,
  doorbell: `${publicUrl}/sounds/doorbell.mp3`,
  pop: `${publicUrl}/sounds/pop.mp3`,
  slap: `${publicUrl}/sounds/slap.mp3`,
  bike: `${publicUrl}/sounds/bike.mp3`,
  theme: `${publicUrl}/sounds/theme.mp3`,
};

export const themeSong = new Audio(SoundMap.theme);
export const clickSound = new UIfx(SoundMap.click);

themeSong.addEventListener("canplaythrough", () => {
  themeSong.loop = true;
});
