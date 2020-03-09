import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_QUESTIONS = gql`
  mutation GetQuestions {
    questions {
      id
      content
    }
  }
`;

export const GameMaster = () => {
  const { data } = useQuery(GET_QUESTIONS);
  return (
    <>
      <h1>Game Master view</h1>
      <div>
        {data.questions.map((question: any) => (
          <div key={question.id}>{question.content}</div>
        ))}
      </div>
    </>
  );
};
