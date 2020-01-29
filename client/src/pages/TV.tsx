import React from 'react';
import { Link } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Button } from 'components';

export const TV = () => {
  return (
    <div>
      <h2>TV</h2>
      <Button
        onClick={() => {
          const themeSong = new Audio(SoundMap.theme);
          themeSong.addEventListener('canplaythrough', () => {
            themeSong.loop = true;
            themeSong.play();
          });
        }}
      >
        Music go
      </Button>
      <Link to="/remote">Remote</Link>
    </div>
  );
};
