import React, { useContext } from 'react';
import { TriviaContext, SceneProps } from 'games/trivia/TriviaContext';

export const TriviaTV: React.FC = () => {
  const { state, broadcast } = useContext(TriviaContext);

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

const Scene1 = ({ state }: SceneProps) => {
  return <h1>{state.question}</h1>;
};

const Scene2 = ({ state }: SceneProps) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
        return <div>{submission.content}</div>;
      })}
    </div>
  );
};

const Scene3 = ({ state }: SceneProps) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
        return (
          <div>
            <p>{submission.content}</p>(
            {submission.endorsers.map(player => {
              return player.name;
            })}
            )
          </div>
        );
      })}
    </div>
  );
};
