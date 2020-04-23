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
  query PackCreatorPagePackQuery($packId: ID!, $actId: ID!) {
    pack(id: $packId) {
      ...Navigation_pack
      ...Sidebar_pack
    }
    act(id: $actId) {
      ...ActPreview_act
    }
  }
`;

export const PackCreatorPage = () => {
  const { packId } = useParams();

  const [selectedAct, setSelectedAct] = useState<any | undefined>(undefined);

  const [selectedActId, setSelectedActId] = useState("");

  const data = useLazyLoadQuery<PackCreatorPagePackQuery>(PackQuery, {
    packId: packId || "",
    actId: selectedActId,
  });

  // const onUpdateAct = (act: Act) => {
  //   // setSelectedAct(act.id);
  // };

  if (!data) {
    return null;
  }

  return (
    <Page>
      {data.pack && (
        <>
          <Navigation pack={data.pack} />
          <Sidebar
            pack={data.pack}
            selectedAct={selectedAct}
            setSelectedAct={setSelectedActId}
          />
        </>
      )}
      <Content>{data.act && <ActPreview act={data.act} />}</Content>
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
