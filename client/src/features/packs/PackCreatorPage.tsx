import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Sidebar } from "features/packs/components/Sidebar";
import { ActPreview } from "features/packs/components/ActPreview";
import { Navigation } from "features/packs/components/Navigation";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery";

const PACK_QUERY = gql`
  query PackCreatorPagePackQuery($packId: ID!, $actId: ID) {
    pack(id: $packId) {
      ...NavigationPackFragment
      ...SidebarPackFragment
    }
    act(id: $actId, packId: $packId) {
      ...ActPreviewFragment
    }
    questionTypes {
      id
      slug
    }
    answerTypes {
      id
      slug
    }
  }
  ${Navigation.fragments.pack}
  ${Sidebar.fragments.pack}
  ${ActPreview.fragments.act}
`;

export const PackCreatorPage = () => {
  const [selectedActId, setSelectedActId] = useState("");
  const { packId } = useParams();
  const { data, refetch } = useQuery<PackCreatorPagePackQuery>(PACK_QUERY, {
    variables: {
      packId: packId || "",
    },
  });

  const handleSelect = (selectedActId: string) => {
    setSelectedActId(selectedActId);
    const newVariables = {
      packId,
      actId: selectedActId,
    };
    refetch(newVariables);
  };

  const refetchActs = () => {
    const newVariables = {
      packId,
      id: selectedActId,
    };
    refetch(newVariables);
  };

  return (
    <Page>
      {data?.pack && (
        <>
          <Navigation pack={data.pack} />
          <Sidebar
            pack={data.pack}
            selectedActId={selectedActId}
            setSelectedAct={handleSelect}
            refetchActs={refetchActs}
          />
        </>
      )}
      <Content>
        {data?.act && (
          <ActPreview selectedActId={selectedActId} act={data.act} />
        )}
      </Content>
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
  grid-template-rows: 50px 1fr 0;
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
