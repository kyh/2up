import React, { useState } from 'react';
import { useTrivia } from 'acts/trivia/useTrivia';
import Debug from 'components/Debug';

export const DebugRemote = () => {
  const [state, broadcast] = useTrivia();
  const [name, setName] = useState('remote');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleJoin = () => {
    broadcast('broadcast', { name, message: 'join' });
  };

  const handleStart = () => {
    broadcast('broadcast', { name, message: 'start' });
  };

  const handleNextScene = () => {
    broadcast('broadcast', { name, message: 'scene:next' });
  };

  const handleNextAct = () => {
    broadcast('broadcast', { name, message: 'act:next' });
  };

  return (
    <>
      <Debug state={state} />
      <div>
        <input onChange={handleChange} />
        <button onClick={handleJoin}>Join</button>
      </div>
      <div>
        <button onClick={handleStart}>Start</button>
      </div>
      <div>
        <button onClick={handleNextScene}>Next scene</button>
      </div>
      <div>
        <button onClick={handleNextAct}>Next act</button>
      </div>
    </>
  );
};
