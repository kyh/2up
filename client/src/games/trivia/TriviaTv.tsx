import React, { useEffect } from 'react';
import { useTrivia } from 'games/trivia/useTrivia';

export const TriviaTV: React.FC = () => {
  const [state, broadcast] = useTrivia();
  useEffect(() => {
    broadcast('game:start');
  }, [state.connected]);

  switch (state.scene) {
    case 1:
      return <Scene1 question={state.question} />;
    case 2:
      return (
        <Scene2 question={state.question} submissions={state.submissions} />
      );
    case 3:
      return <Scene3 />;
    default:
      return null;
  }
};

const Scene1 = ({ question }: { question: string }) => {
  return <h1>{question}</h1>;
};

const Scene2 = ({ question, submissions }: any) => {
  return (
    <div>
      <h2>{question}</h2>
      {submissions.map((s: any) => {
        return <div>{s.content}</div>;
      })}
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
