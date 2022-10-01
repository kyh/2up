import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useHotkeys } from "@react-hook/hotkey";
import { theme } from "~/styles/theme";
import { visible } from "~/styles/animations";
import { Topbar } from "~/lib/packs/components/PackCreatorTopbar";
import { Sidebar } from "~/lib/packs/components/PackCreatorLeftSidebar";
import { ScenePreview } from "~/lib/packs/components/ScenePreview";
import { SceneQATypeMenu } from "~/lib/packs/components/SceneQATypeMenu";
import { SceneSettingsMenu } from "~/lib/packs/components/SceneSettingsMenu";
import { Button, Modal, Icon, Spinner } from "~/components";
import {
  keybindings,
  instructionElementAttribute,
} from "~/lib/packs/packUtils";
import { useHostGame } from "~/lib/game/useGameActions";
import {
  usePackStore,
  VisibleQATypeMenu,
  SceneWithAnswers,
} from "~/lib/packs/packStore";
import { useGetPack } from "~/lib/packs/usePackActions";
import ArrowSvg from "./svgs/arrow.svg";

export const PackCreator = () => {
  const router = useRouter();
  const screenRef = useRef<null | HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const { hostGame } = useHostGame();
  const setPackScenes = usePackStore((state) => state.setPackScenes);
  const setVisibleQATypeMenu = usePackStore(
    (state) => state.setVisibleQATypeMenu
  );
  const packId = router.query.packId as string;
  const { data: pack, isLoading, refetch } = useGetPack(packId, true);

  const packScenes = pack?.scenes;
  const selectedScene = packScenes?.find(
    (scene) => scene.id === selectedSceneId
  ) as SceneWithAnswers;

  const selectScene = (selectedSceneId: string) => {
    setVisibleQATypeMenu(VisibleQATypeMenu.None);
    setSelectedSceneId(selectedSceneId);
  };

  const testPlay = () => {
    hostGame(packId, true);
  };

  const toggleHelpModal = () => {
    setIsOpen((open) => {
      return !open;
    });
  };

  const selectScenePosition = (position: 1 | -1) => (e: KeyboardEvent) => {
    if (!packScenes) return;
    const target = e.target as HTMLElement;
    if (target && target.tagName === "TEXTAREA") return;
    const currentSceneIndex = packScenes.findIndex(
      (scene) => scene.id === selectedSceneId
    );
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

  useHotkeys(typeof window !== "undefined" ? window : null, [
    [keybindings.testPlay.hotkey, testPlay],
    [keybindings.showShortcuts.hotkey, toggleHelpModal],
    [keybindings.previousScene.hotkey, selectScenePosition(-1)],
    [keybindings.nextScene.hotkey, selectScenePosition(1)],
    [
      keybindings.focusScene.hotkey,
      focusElement(`[data-focusable="${instructionElementAttribute}"]`),
    ],
  ]);

  useEffect(() => {
    if (packScenes && packScenes.length !== 0 && !selectedSceneId) {
      setSelectedSceneId(packScenes[0].id);
      setPackScenes(packScenes as SceneWithAnswers[]);
    }
  }, [packScenes]);

  if (isLoading || !pack) {
    return <Spinner center />;
  }

  return (
    <Page>
      <Topbar pack={pack} testPlay={testPlay} />
      <SidebarLeft>
        <Sidebar
          packId={packId}
          packScenes={packScenes || []}
          selectedSceneId={selectedSceneId}
          selectScene={selectScene}
          refetch={refetch}
        />
      </SidebarLeft>
      {selectedScene ? (
        <>
          <Content>
            <Screen ref={screenRef}>
              <ScenePreview scene={selectedScene} />
            </Screen>
          </Content>
          <SidebarRight>
            <SceneSettingsMenu scene={selectedScene} />
          </SidebarRight>
          <Footer>
            <SceneQATypeMenu scene={selectedScene} />
          </Footer>
        </>
      ) : (
        <EmptyContent>
          <div className="empty-content">
            <h1>Wow it&apos;s a brand new pack!</h1>
            <p>Here&apos;s how it works:</p>
            <ul>
              <li>A pack contains many scenes</li>
              <li>A scene has a question and a answer</li>
              <li>
                There are many different types of questions & answers (text
                questions, image questions, single answers, multiple choice
                answers etc.)
              </li>
              <li>
                Mix & match your own combinations for a unique trivia experience
              </li>
              <li>You get the gist of it, add your first scene to begin</li>
            </ul>
          </div>
          <ArrowSvg className="arrow" />
        </EmptyContent>
      )}
      <HelpButton variant="fab" onClick={toggleHelpModal}>
        <Icon icon="question" size="sm" />
      </HelpButton>
      <Modal
        open={isOpen}
        title="Keyboard shortcuts"
        onClose={toggleHelpModal}
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
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;

  .arrow {
    position: absolute;
    bottom: 65px;
    left: 225px;
    filter: brightness(0.5);

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
