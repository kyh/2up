import raw from "raw.macro";
import { useState, useRef, SyntheticEvent } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useHotkeys } from "@react-hook/hotkey";
import { theme } from "styles/theme";
import { Topbar } from "features/packs/components/PackCreatorTopbar";
import { Sidebar } from "features/packs/components/PackCreatorLeftSidebar";
import { ScenePreview } from "features/packs/components/ScenePreview";
import { SceneQATypeMenu } from "features/packs/components/SceneQATypeMenu";
import { SceneSettingsMenu } from "features/packs/components/SceneSettingsMenu";
import { Button, Modal, Icon, Svg } from "components";
import {
  VisibleQATypeMenu,
  visibleQATypeMenuVar,
  keybindings,
  instructionElementAttribute,
} from "features/packs/sceneService";
import { useHostGame } from "features/game/gameService";

import { PackCreatorPagePackQuery } from "./__generated__/PackCreatorPagePackQuery";
import { SidebarPackFragment_scenes_edges_node } from "./components/__generated__/SidebarPackFragment";

const arrowSvg = raw("./svgs/arrow.svg");

export const PackCreatorPage = () => {
  const screenRef = useRef<null | HTMLDivElement>(null);
  const hostGame = useHostGame();
  const [isOpen, setIsOpen] = useState(false);
  const { packId } = useParams<{ packId: string }>();
  const { data, refetch } = useQuery<PackCreatorPagePackQuery>(PACK_QUERY, {
    variables: {
      packId: packId || "",
    },
  });

  const selectScene = (selectedSceneId: string) => {
    visibleQATypeMenuVar(VisibleQATypeMenu.None);
    const newVariables = {
      packId,
      sceneId: selectedSceneId,
    };
    refetch(newVariables);
  };

  const testPlay = () => {
    hostGame(packId);
  };

  const toggleHelpModal = () => {
    setIsOpen((open) => {
      return !open;
    });
  };

  const selectScenePosition = (position: 1 | -1) => () => {
    const currentSceneIndex = packScenes.findIndex((scene) => {
      return scene.id === data?.scene?.id;
    });
    if (currentSceneIndex !== -1) {
      const newSelectedScene =
        packScenes[
          position === 1 ? currentSceneIndex + 1 : currentSceneIndex - 1
        ];
      if (newSelectedScene) {
        selectScene(newSelectedScene.id);
      }
    }
  };

  const hideQATypeMenu = (e: SyntheticEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }
    visibleQATypeMenuVar(VisibleQATypeMenu.None);
  };

  const focusElement = (query: string) => (e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }
    if (screenRef && screenRef.current) {
      const element = screenRef.current.querySelector(
        query
      ) as HTMLInputElement;
      element.focus();
    }
  };

  useHotkeys(window, [
    [keybindings.testPlay.hotkey, testPlay],
    [keybindings.showShortcuts.hotkey, toggleHelpModal],
    [keybindings.previousScene.hotkey, selectScenePosition(-1)],
    [keybindings.nextScene.hotkey, selectScenePosition(1)],
    [
      keybindings.focusScene.hotkey,
      focusElement(`[data-focusable="${instructionElementAttribute}"]`),
    ],
  ]);

  if (!data || !data.pack) {
    return null;
  }

  const packScenes = (data.pack.scenes?.edges || [])
    .map((edge) => {
      const scene = edge?.node;
      if (!scene) return null;
      return scene;
    })
    .filter(Boolean) as SidebarPackFragment_scenes_edges_node[];

  return (
    <Page>
      <ReactTooltip effect="solid" place="bottom" />
      <Topbar pack={data.pack} testPlay={testPlay} />
      <SidebarLeft>
        <Sidebar
          packId={packId}
          packScenes={packScenes}
          selectedSceneId={data.scene?.id}
          selectScene={selectScene}
          refetch={refetch}
        />
      </SidebarLeft>
      {data?.scene ? (
        <>
          <Content onClick={hideQATypeMenu}>
            <Screen ref={screenRef}>
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
      ) : (
        <EmptyContent>
          <div className="empty-content">
            <h1>Wow it's a brand new pack!</h1>
            <p>Here's how it works:</p>
            <ul>
              <li>A pack contains many scenes</li>
              <li>A scene has a question and answer</li>
              <li>
                There are different types of question/answer (text questions,
                image questions, single answers, multiple choice answers etc.)
              </li>
              <li>You get the gist of it, add your first scene to begin</li>
            </ul>
          </div>
          <Svg className="arrow" content={arrowSvg} />
        </EmptyContent>
      )}
      <HelpButton variant="fab" onClick={toggleHelpModal}>
        <Icon icon="question" size="sm" />
      </HelpButton>
      <Modal
        open={isOpen}
        title="Keyboard shortcuts"
        onRequestClose={toggleHelpModal}
        maxWidth={500}
        closeButton
      >
        <HelpModalContent>
          {Object.values(keybindings).map((binding) => (
            <div className="keybinding" key={binding.display}>
              <div>{binding.description}</div>
              <code>{binding.display}</code>
            </div>
          ))}
        </HelpModalContent>
      </Modal>
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

const Page = styled.section`
  height: 100vh;
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

const Content = styled.section`
  grid-area: content;
  padding: ${theme.spacings(7)};
`;

const EmptyContent = styled(Content)`
  display: flex;

  .arrow {
    position: absolute;
    bottom: 65px;
    left: 225px;
    opacity: 0.5;

    > svg {
      width: 250px;
      height: auto;
    }
  }

  .empty-content {
    text-align: center;
    max-width: 600px;
    margin: auto;

    > p {
      margin-bottom: ${theme.spacings(5)};
    }
  }

  ul {
    text-align: left;
  }
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

const HelpButton = styled(Button)`
  position: fixed;
  bottom: ${theme.spacings(3)};
  right: ${theme.spacings(3)};
  padding: ${theme.spacings(2)};
`;

const HelpModalContent = styled.div`
  .keybinding {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(2)};

    > code {
      background-color: ${theme.ui.backgroundGrey};
      padding: ${theme.spacings(1)} ${theme.spacings(2)};
      font-size: 0.9rem;
    }
  }
`;
