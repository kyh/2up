import React from 'react';
import { Button } from 'components';
import { SceneProps } from 'games/trivia/TriviaContext';

export const Scene3 = ({ state, broadcast }: SceneProps) => {
  return (
    <div>
      <h2>{state.question}</h2>
      {state.submissions.map(submission => {
        return (
          <div>
            <h2>Submission</h2>
            <p>{submission.content}</p>
            <p>By: {submission.name}</p>
            <h2>Endorsements</h2>
            {submission.endorsers.map(endorser => {
              return <p>{endorser.name}</p>;
            })}
          </div>
        );
      })}
      <h2>Coins</h2>
      {state.players.map(player => (
        <div>
          <h3>{player.name}</h3>
          <h4>{player.coins}</h4>
        </div>
      ))}
      <Button
        onClick={() =>
          broadcast('game:next', {
            gameID: state.gameID
          })
        }
      >
        Next Act
      </Button>
    </div>
  );
};
