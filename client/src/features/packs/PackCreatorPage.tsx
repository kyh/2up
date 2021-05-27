import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { theme } from "styles/theme";
import { Topbar } from "features/packs/components/Topbar";
import { Sidebar } from "features/packs/components/Sidebar";
import { ScenePreview } from "features/packs/components/ScenePreview";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery";

export const PackCreatorPage = () => {
  const [saving, setSaving] = useState(false);
  const { packId } = useParams<{ packId: string }>();
  const { data, refetch } = useQuery<PackCreatorPagePackQuery>(PACK_QUERY, {
    variables: {
      packId: packId || "",
    },
  });

  const selectScene = (selectedSceneId: string) => {
    const newVariables = {
      packId,
      sceneId: selectedSceneId,
    };
    refetch(newVariables);
  };

  return (
    <Page>
      {data?.pack && (
        <>
          <Topbar pack={data.pack} saving={saving} setSaving={setSaving} />
          <Sidebar
            pack={data.pack}
            selectedSceneId={data.scene?.id}
            selectScene={selectScene}
            refetch={refetch}
            setSaving={setSaving}
          />
        </>
      )}
      <Content>
        {data?.scene && (
          <ScenePreview scene={data.scene} setSaving={setSaving} />
        )}
      </Content>
    </Page>
  );
};

const PACK_QUERY = gql`
  query PackCreatorPagePackQuery($packId: ID!, $sceneId: ID) {
    pack(id: $packId) {
      ...TopbarPackFragment
      ...SidebarPackFragment
    }
    scene(id: $sceneId, packId: $packId) {
      ...ScenePreviewFragment
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
  ${Topbar.fragments.pack}
  ${Sidebar.fragments.pack}
  ${ScenePreview.fragments.scene}
`;

export const Page = styled.section`
  height: var(--vh, 100vh);
  display: grid;
  background: ${theme.ui.backgroundGrey};
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
  padding: ${theme.spacings(5)};
`;

// const Footer = styled.footer`
//   grid-area: footer;
//   display: flex;
//   padding: ${theme.spacings(4)};
// `;
