import React, { useEffect } from 'react';
import { useTrivia } from 'games/trivia/useTrivia';

export const TriviaTV: React.FC = () => {
  const [state, broadcast] = useTrivia();

  useEffect(() => {
    if (state.connected) broadcast('game:join', {});
  }, [state.connected, broadcast]);

  switch (state.scene) {
    case 1:
      return <Scene1 broadcast={broadcast} state={state} />;
    case 2:
      return <Scene2 broadcast={broadcast} state={state} />;
    case 3:
      return <Scene3 broadcast={broadcast} state={state} />;
    default:
      return null;
  }
};

const Scene1 = ({ state }: any) => {
  return <h1>{state.question}</h1>;
};

const Scene2 = ({ state }: any) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map((submission: any) => {
        return <div>{submission.content}</div>;
      })}
    </div>
  );
};

const Scene3 = ({ state }: any) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map((submission: any) => {
        return (
          <div>
            <p>{submission.content}</p>(
            {submission.endorsements.map((endorsement: any) => {
              return endorsement.player;
            })}
            )
          </div>
        );
      })}
    </div>
  );
};
