import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_QUESTIONS = gql`
  query GetQuestions {
    questions {
      id
      content
    }
  }
`;

export const GameMaster = () => {
  const { data, loading } = useQuery(GET_QUESTIONS);
  if (loading) return null;
  return (
    <Page>
      <h1>Game Master view</h1>
      <div>
        {data.questions.map((question: any) => (
          <div key={question.id}>{question.content}</div>
        ))}
      </div>
    </Page>
  );
};

const Page = styled.section`
  overflow: auto;
  height: calc((var(--vh, 1vh) * 100) - 50px);
`;
