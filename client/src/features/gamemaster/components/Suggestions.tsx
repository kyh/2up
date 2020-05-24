import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Button } from "components";

import { SuggestionsActsQuery } from "./__generated__/SuggestionsActsQuery";

type SuggestionsProps = {
  questionTypeId: string;
  answerTypeId: string;
};

const ACTS_QUERY = gql`
  query SuggestionsActsQuery(
    $questionTypeId: ID!
    $answerTypeId: ID!
    $after: String
  ) {
    acts(
      first: 5
      questionTypeId: $questionTypeId
      answerTypeId: $answerTypeId
      after: $after
    ) {
      edges {
        node {
          id
          question
          answer
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const Suggestions = ({
  questionTypeId,
  answerTypeId,
}: SuggestionsProps) => {
  const { data, fetchMore } = useQuery<SuggestionsActsQuery>(ACTS_QUERY, {
    variables: { questionTypeId, answerTypeId },
  });

  const acts = data?.acts?.edges || [];

  const onFetchMoreClick = () => {
    const pageInfo = data?.acts?.pageInfo;
    if (!pageInfo?.hasNextPage) {
      return null;
    }

    fetchMore({
      variables: { questionTypeId, answerTypeId, after: pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.acts) return previousResult;
        if (!previousResult || !previousResult.acts) return fetchMoreResult;

        const oldEdges = previousResult.acts.edges || [];
        const pageInfo = fetchMoreResult.acts.pageInfo;
        const newEdges = fetchMoreResult.acts.edges || [];

        return {
          ...previousResult,
          acts: {
            __typename: previousResult.acts.__typename,
            edges: [...oldEdges, ...newEdges],
            pageInfo,
          },
        };
      },
    });
  };

  return (
    <>
      {acts.map((act) => (
        <QuestionTemplate>
          <span>{act?.node?.question}</span>
        </QuestionTemplate>
      ))}
      <Button onClick={onFetchMoreClick}>Fetch More</Button>
    </>
  );
};

const QuestionTemplate = styled.div`
  width: 150px;
  background: ${({ theme }) => theme.ui.background};
  height: 100%;
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-right: ${({ theme }) => theme.spacings(4)};
  border: 2px solid ${({ theme }) => theme.ui.backgroundInverse};
`;
