import React, { Suspense } from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";
import { GameMasterQuestionsQuery } from "./__generated__/GameMasterQuestionsQuery.graphql";

const QuestionsQuery = graphql`
  query GameMasterQuestionsQuery {
    questions {
      id
      content
    }
  }
`;

export const GameMaster = () => {
  return (
    <Page>
      <h1>Game Master view</h1>
      <Suspense fallback="Loading...">
        <Questions />
      </Suspense>
    </Page>
  );
};

const Questions = () => {
  const data = useLazyLoadQuery<GameMasterQuestionsQuery>(QuestionsQuery, {});
  return (
    <div>
      {data?.questions?.map((question: any) => (
        <div key={question.id}>{question.content}</div>
      ))}
    </div>
  );
};

const Page = styled.section`
  overflow: auto;
  height: calc((var(--vh, 1vh) * 100) - 50px);
`;
