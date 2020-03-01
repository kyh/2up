import React, { useEffect, useState } from 'react';

export const GameMaster = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query: '{ questions { id content } }' })
    })
      .then(r => r.json())
      .then(res => setQuestions(res.data.questions));
  });
  return (
    <>
      <h1>Game Master view</h1>
      <div>
        {questions.map((question: any) => (
          <div key={question.id}>{question.content}</div>
        ))}
      </div>
    </>
  );
};
