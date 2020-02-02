import React, { useEffect } from 'react';
import { useTrivia } from 'games/trivia/useTrivia';

export const TriviaTV: React.FC = () => {
  return <Scene1 />;
};

const Scene1 = () => {
  const [state, broadcast] = useTrivia();

  useEffect(() => {
    broadcast('broadcast', { message: 'scene1' });
  }, [state?.isConnected])

  if (state?.submissionCount > state?.players?.length - 1) {
    return <Scene2 />
  }

  return (
    <div>
      <p>{state?.question}</p>
      <p>{state?.players?.length}</p>
    </div>
  );
};

const Scene2 = () => {
  return (
    <div>
      <h2>Who was the 5th president of the United States?</h2>
      <div>George Bush</div>
      <div>yellowstone</div>
      <div>Some guy</div>
      <div>Rick Austin</div>
    </div>
  );
};

const Scene3 = () => {
  return (
    <div>
      <h2>Who was the 5th president of the United States?</h2>
      <div>George Bush (kai, andrew)</div>
      <div>yellowstone (vivian)</div>
      <div>Some guy</div>
      <div>Rick Austin</div>
    </div>
  );
};
