import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { Sidebar } from "features/gamemaster/components/Sidebar";
import { ActPreview } from "features/gamemaster/components/ActPreview";
import { useLazyLoadQuery } from "react-relay/hooks";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery.graphql";
import { Navigation } from "./components/Navigation";

import graphql from "babel-plugin-relay/macro";
const PackQuery = graphql`
  query PackCreatorPagePackQuery($id: ID!) {
    pack(id: $id) {
      id
      name
      acts(first: 100) @connection(key: "PackCreatorPage_acts", filters: []) {
        edges {
          node {
            id
            answer
            question
            questionType {
              slug
            }
            answerType {
              slug
            }
          }
        }
      }
    }
  }
`;

// TODO: Replace with auto generated fragment
export type Act = {
  id: string;
  instruction?: string;
  questionType: {
    slug: string;
  };
  question: string;
  answerType: {
    slug: string;
  };
  answer: string | null;
};

export const PackCreatorPage = () => {
  const { packId } = useParams();

  const [selectedAct, setSelectedAct] = useState<Act | undefined>(undefined);

  const data = useLazyLoadQuery<PackCreatorPagePackQuery>(PackQuery, {
    id: packId || "",
  });

  const newActs: Act[] =
    data?.pack?.acts?.edges
      ?.map((edge: any) => (edge?.node ? edge.node : null))
      .filter((node: Act) => !!node) || [];

  const onUpdateAct = (act: Act) => {
    // setSelectedAct(act.id);
  };

  return (
    <Page>
      <Navigation />
      <Sidebar
        packId={packId || ""}
        acts={newActs}
        selectedAct={selectedAct}
        setSelectedAct={setSelectedAct}
      />
      <Content>
        <ActPreview selectedAct={selectedAct} onUpdateAct={onUpdateAct} />
      </Content>
      <Footer>
        <QuestionTemplate />
        <QuestionTemplate />
        <QuestionTemplate />
      </Footer>
    </Page>
  );
};

export const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "sidebar content content"
    "sidebar  footer  footer";
  grid-template-columns: 345px 1fr 1fr;
  grid-template-rows: 50px 1fr 150px;
`;

export const Content = styled.section`
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacings(5)};
`;

const Footer = styled.footer`
  grid-area: footer;
  display: flex;
  padding: ${({ theme }) => theme.spacings(4)};
`;

const QuestionTemplate = styled.div`
  width: 150px;
  background: ${({ theme }) => theme.ui.background};
  height: 100%;
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-right: ${({ theme }) => theme.spacings(4)};
  border: 2px solid ${({ theme }) => theme.ui.backgroundInverse};
`;
