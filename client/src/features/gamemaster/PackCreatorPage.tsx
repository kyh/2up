import React, { useState } from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useParams } from "react-router-dom";
import { useLazyLoadQuery } from "react-relay/hooks";

import { Sidebar } from "features/gamemaster/components/Sidebar";
import { ActPreview } from "features/gamemaster/components/ActPreview";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery.graphql";
import { Navigation } from "./components/Navigation";

const PackQuery = graphql`
  query PackCreatorPagePackQuery($packId: ID!, $actId: ID!) {
    pack(id: $packId) {
      ...Navigation_pack
      ...Sidebar_pack
    }
    ...ActPreview_act @arguments(actId: $actId)
  }
`;

export const PackCreatorPage = () => {
  const [selectedActId, setSelectedActId] = useState("");

  const { packId } = useParams();

  const data = useLazyLoadQuery<PackCreatorPagePackQuery>(PackQuery, {
    packId: packId || "",
    actId: "", // TODO: if not specified grab the first id
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
            selectedActId={selectedActId}
            setSelectedAct={setSelectedActId}
          />
        </>
      )}
      <React.Suspense fallback="Loading...">
        <Content>
          {data && <ActPreview selectedActId={selectedActId} act={data} />}
        </Content>
      </React.Suspense>
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
