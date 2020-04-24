import React, { useState } from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useParams } from "react-router-dom";

import { Sidebar } from "features/gamemaster/components/Sidebar";
import { ActPreview } from "features/gamemaster/components/ActPreview";
import { useLazyLoadQuery, useFragment } from "react-relay/hooks";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery.graphql";
import { PackCreatorPage_view$key } from "./__generated__/PackCreatorPage_view.graphql";
import { Navigation } from "./components/Navigation";

const PackQuery = graphql`
  query PackCreatorPagePackQuery($packId: ID!, $actId: ID!) {
    ...PackCreatorPage_view @arguments(packId: $packId, actId: $actId)
  }
`;

export const PackCreatorPageContainer = () => {
  const { packId } = useParams();

  const data = useLazyLoadQuery<PackCreatorPagePackQuery>(PackQuery, {
    packId: packId || "",
    actId: "", // TODO: if not specified grab the first id
  });

  return <PackCreatorPage view={data} />;
};

type PackCreatorPageProps = {
  view: PackCreatorPage_view$key;
};

export const PackCreatorPage = ({ view }: PackCreatorPageProps) => {
  const [selectedAct, setSelectedAct] = useState<any | undefined>(undefined);
  const [selectedActId, setSelectedActId] = useState("");

  const data = useFragment(
    graphql`
      fragment PackCreatorPage_view on RootQueryType
        @argumentDefinitions(packId: { type: "ID!" }, actId: { type: "ID!" }) {
        pack(id: $packId) {
          ...Navigation_pack
          ...Sidebar_pack
        }
        ...ActPreview_act @arguments(actId: $actId)
      }
    `,
    view
  );

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
