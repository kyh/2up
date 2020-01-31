import React from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Button } from 'components';

export const TV = () => {
  const history = useHistory();
  return (
    <div>
      <h2>TV</h2>
      <Button
        onClick={() => {
          const themeSong = new Audio(SoundMap.theme);
          themeSong.addEventListener('canplaythrough', () => {
            themeSong.loop = true;
            themeSong.play();
            history.push('/remote/messaging');
          });
        }}
      >
        Start
      </Button>
    </div>
  );
};
