import { useState } from 'react';
import UIfx from 'uifx';

const publicUrl = process.env.PUBLIC_URL;

const SoundMap = {
  click: `${publicUrl}/sounds/click.mp3`,
  doorbell: `${publicUrl}/sounds/doorbell.mp3`,
  pop: `${publicUrl}/sounds/pop.mp3`,
  slap: `${publicUrl}/sounds/slap.mp3`,
  bike: `${publicUrl}/sounds/bike.mp3`,
  theme: `${publicUrl}/sounds/theme.mp3`
};

const themeSong = new Audio(SoundMap.theme);

themeSong.addEventListener('canplaythrough', () => {
  themeSong.loop = true;
});

const clickSound = new UIfx(SoundMap.click);

export const useMusic = () => {
  const [musicOn, setMusic] = useState(
    localStorage.getItem('music') === 'true' ||
      localStorage.getItem('music') === undefined
  );
  const [SFXOn, setSFX] = useState(
    localStorage.getItem('SFX') === 'true' ||
      localStorage.getItem('SFX') === undefined
  );

  const toggleMusic = () => {
    const updatedMusicOn = !musicOn;
    if (updatedMusicOn) {
      themeSong.play();
    } else {
      themeSong.pause();
    }
    localStorage.setItem('music', updatedMusicOn.toString());
    setMusic(updatedMusicOn);
  };

  const toggleSFX = () => {
    const updatedSFXOn = !SFXOn;
    localStorage.setItem('SFX', updatedSFXOn.toString());
    setSFX(updatedSFXOn);
  };

  const playClick = () => {
    if (SFXOn) {
      clickSound.play();
    }
  };

  const playMusic = () => {
    if (musicOn) {
      themeSong.play();
    }
  };

  return { playClick, playMusic, toggleSFX, toggleMusic, musicOn, SFXOn };
};
