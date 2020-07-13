import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Button } from "components";
import { ActTemplate } from "features/packs/components/SceneTemplate";

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
        ...ActTemplateFragment
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${ActTemplate.fragments.act}
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

  const onQuestionTemplateClick = () => {
    console.log("");
  };

  return (
    <>
      {acts.map((act) => {
        return (
          act && <ActTemplate act={act} onClick={onQuestionTemplateClick} />
        );
      })}
      <Button onClick={onFetchMoreClick}>Fetch More</Button>
    </>
  );
};
