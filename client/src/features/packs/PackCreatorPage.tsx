import { useState } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAlert } from "react-alert";
import { useForm } from "react-hook-form";
import { theme } from "styles/theme";
import { Topbar } from "features/packs/components/PackCreatorTopbar";
import { Sidebar } from "features/packs/components/PackCreatorLeftSidebar";
import { ScenePreview } from "features/packs/components/ScenePreview";
import { SceneQATypeMenu } from "features/packs/components/SceneQATypeMenu";
import { SceneSettingsMenu } from "features/packs/components/SceneSettingsMenu";
import {
  VisibleQATypeMenu,
  visibleQATypeMenuVar,
} from "features/packs/sceneService";
import { Modal } from "components";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery";
import { PackCreatorPageCsvImportMutation } from "./__generated__/PackCreatorPageCsvImportMutation";

type FormInputs = {
  csv: string;
};

export const PackCreatorPage = () => {
  const alert = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { packId } = useParams<{ packId: string }>();
  const { data, refetch } = useQuery<PackCreatorPagePackQuery>(PACK_QUERY, {
    variables: {
      packId: packId || "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [csvImport] = useMutation<PackCreatorPageCsvImportMutation>(CSV_IMPORT);

  const selectScene = (selectedSceneId: string) => {
    visibleQATypeMenuVar(VisibleQATypeMenu.None);
    const newVariables = {
      packId,
      sceneId: selectedSceneId,
    };
    refetch(newVariables);
  };

  const openCsvImport = () => {
    setIsModalOpen(true);
  };

  const onSubmit = async ({ csv }: FormInputs) => {
    try {
      csvImport({
        variables: {
          input: { packId, csv },
        },
      });
    } catch (error) {
      alert.show(error.message);
    }
  };

  if (!data || !data.pack) {
    return null;
  }

  return (
    <Page>
      <ReactTooltip effect="solid" place="bottom" />
      <Topbar pack={data.pack} />
      <SidebarLeft>
        <Sidebar
          pack={data.pack}
          selectedSceneId={data.scene?.id}
          selectScene={selectScene}
          refetch={refetch}
          openCsvImport={openCsvImport}
        />
      </SidebarLeft>
      {data?.scene && (
        <>
          <Content>
            <Screen>
              <ScenePreview scene={data.scene} />
            </Screen>
          </Content>
          <SidebarRight>
            <SceneSettingsMenu scene={data.scene} />
          </SidebarRight>
          <Footer>
            <SceneQATypeMenu scene={data.scene} />
          </Footer>
        </>
      )}
      <Modal open={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            id="csv"
            {...register("csv", { required: true })}
          ></textarea>
          <input type="submit" value="Import CSV" />
        </form>
      </Modal>
      <Footer />
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

const CSV_IMPORT = gql`
  mutation PackCreatorPageCsvImportMutation($input: CsvImportInput!) {
    csvImport(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

export const Page = styled.section`
  height: var(--vh, 100vh);
  display: grid;
  background: ${theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header header"
    "sidebarL content content sidebarR"
    "sidebarL  footer  footer sidebarR";
  grid-template-columns: 215px 1fr 1fr 100px;
  grid-template-rows: 50px 1fr 50px;
`;

const SidebarLeft = styled.section`
  grid-area: sidebarL;
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100%;
  border-right: 1px solid ${theme.ui.borderColor};
`;

export const Content = styled.section`
  grid-area: content;
  padding: ${theme.spacings(7)};
`;

const Screen = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.ui.background};
  padding: ${theme.spacings(5)};
  width: 100%;
  border: 2px solid ${theme.ui.borderColor};
  border-radius: ${theme.ui.borderWavyRadius};
  /* screen - top - padding - footer - padding */
  height: calc(100vh - 50px - 40px - 50px - 16px);
  overflow: auto;
`;

const SidebarRight = styled.section`
  grid-area: sidebarR;
  padding: ${theme.spacings(7)} ${theme.spacings(3)};
  height: 100%;
`;

const Footer = styled.footer`
  grid-area: footer;
  position: relative;
`;
