import React from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Button } from 'components';

export const Intro = () => {
  const history = useHistory();

  const onClickStart = () => {
    const themeSong = new Audio(SoundMap.theme);
    themeSong.addEventListener('canplaythrough', () => {
      themeSong.loop = true;
      // themeSong.play();
      history.push('/tv/trivia');
    });
  };

  return (
    <div>
      <Button onClick={onClickStart}>Start TV</Button>
    </div>
  );
};
