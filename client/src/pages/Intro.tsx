import React from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Button } from 'components';

export const Intro = () => {
  const history = useHistory();

  const onClickStart = (url: string) => {
    return () => {
      const themeSong = new Audio(SoundMap.theme);
      themeSong.addEventListener('canplaythrough', () => {
        themeSong.loop = true;
        // themeSong.play();
        history.push(`/${url}/trivia`);
      });
    };
  };

  return (
    <div>
      <Button onClick={onClickStart('tv')}>Start TV</Button>
      <Button onClick={onClickStart('remote')}>Start Remote</Button>
    </div>
  );
};
