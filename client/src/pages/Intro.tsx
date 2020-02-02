import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SoundMap } from 'styles/sounds';
import { Button, Input } from 'components';

export const Intro = () => {
  const history = useHistory();
  const [name, setName] = useState(localStorage.getItem('name') || '');

  const onClickStartTv = () => {
    const themeSong = new Audio(SoundMap.theme);
    themeSong.addEventListener('canplaythrough', () => {
      themeSong.loop = true;
      // themeSong.play();
      history.push('/tv/trivia');
    });
  };

  const onClickStartRemote = () => {
    localStorage.setItem('name', name);
    history.push('/remote/trivia');
  };

  return (
    <div>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={onClickStartTv}>Start TV</Button>
      <Button onClick={onClickStartRemote}>Start Remote</Button>
    </div>
  );
};
