import React, { useState, useContext } from 'react';
import { Flex, Input, Button } from 'components';
import { TriviaContext, SceneProps } from 'games/trivia/TriviaContext';

export const TriviaRemote: React.FC = () => {
  const { state, broadcast } = useContext(TriviaContext);

  switch (state.scene) {
    case 1:
      return <Scene1 state={state} broadcast={broadcast} />;
    case 2:
      return <Scene2 state={state} broadcast={broadcast} />;
    case 3:
      return <Scene3 state={state} broadcast={broadcast} />;
    default:
      return null;
  }
};

const Scene1 = ({ state, broadcast }: SceneProps) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    broadcast('player:submit', {
      name: localStorage.getItem('name'),
      gameID: state.gameID,
      submission: value
    });
    setSubmitted(true);
  };

  return (
    <Flex alignItems="center" flexDirection="column">
      <h1>{state.question}</h1>
      <Input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        readOnly={submitted}
      />
      <Button disabled={submitted} onClick={handleClick}>
        Submit answer
      </Button>
    </Flex>
  );
};

const Scene2 = ({ state, broadcast }: SceneProps) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
        return (
          <Button
            onClick={() => broadcast('player:endorse', {
              name: localStorage.getItem('name'),
              gameID: state.gameID,
              submissionID: submission.id
            })}
          >
            {submission.content}
          </Button>
        )
      })}
      <Button
        onClick={() => broadcast('player:answer', {
          name: localStorage.getItem('name'),
          gameID: state.gameID
        })}
      >
        {state.answer}
      </Button>
    </div>
  );
};

const Scene3 = ({ state }: SceneProps) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.endorsements.map(endorsement => {
        return (
          <div>
            <p>{endorsement.id}</p>
            <p>{endorsement.player_id}</p>
            <p>{endorsement.submission_id}</p>
            <p>{endorsement.answer_id}</p>
          </div>
        );
      })}
    </div>
  );
};
