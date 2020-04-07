import React from "react";

interface DebugProps {
  state: any;
}

const Debug = ({ state }: DebugProps) => (
  <>
    <div>
      <p>Act: {state?.act}</p>
      <p>Scene: {state?.scene}</p>
    </div>
    <div>
      <h1>Question</h1>
      <p>{state?.question}</p>
    </div>
    <div>
      <h2>Answer</h2>
      <p>{state?.answer}</p>
    </div>
    <div>
      <h2>Players</h2>
      {Object.keys(state?.players || {}).map((player) => (
        <p key={player}>{player}</p>
      ))}
    </div>
  </>
);

export default Debug;
