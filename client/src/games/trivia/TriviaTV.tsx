import React, { useContext } from 'react';
import { TriviaContext, SceneProps } from 'games/trivia/TriviaContext';
import { hashCode } from 'utils/stringUtils';
import { SubmissionsContainer } from './components/SubmissionsContainer';

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
    <>
      <h2>{state.question}</h2>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          const s = hashCode(submission.content);
          return (
            <div key={submission.id} className={`s${s % 10}`}>
              {submission.content}
            </div>
          );
        })}
      </SubmissionsContainer>
    </>
  );
};

const Scene3 = ({ state }: SceneProps) => {
  return (
    <>
      <h2>{state.question}</h2>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          const s = hashCode(submission.content);
          return (
            <div key={submission.id} className={`s${s % 10}`}>
              <div>
                {submission.content} by {submission.name}
              </div>
              <div>
                {submission.endorsers.map(endorser => {
                  return <p key={endorser.id}>{endorser.name}</p>;
                })}
              </div>
            </div>
          );
        })}
      </SubmissionsContainer>
    </>
  );
};
