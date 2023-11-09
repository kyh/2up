import { useEffect, useState, useRef } from "react";
import { classed } from "@/lib/utils/classed";
import { useRouter } from "next/router";
import { useHotkeys } from "@react-hook/hotkey";
import { Topbar } from "@/lib/packs/components/pack-creator-topbar";
import { Sidebar } from "@/lib/packs/components/pack-creator-left-sidebar";
import { ScenePreview } from "@/lib/packs/components/scene-preview";
import { SceneQATypeMenu } from "@/lib/packs/components/scene-qa-type-menu";
import { SceneSettingsMenu } from "@/lib/packs/components/scene-settings-menu";
import { Button, Modal, Icon, Spinner } from "@/components";
import {
  keybindings,
  instructionElementAttribute,
} from "@/lib/packs/pack-utils";
import { useHostGame } from "@/lib/game/use-game-actions";
import {
  usePackStore,
  VisibleQATypeMenu,
  SceneWithAnswers,
} from "@/lib/packs/pack-store";
import { useGetPack } from "@/lib/packs/use-pack-actions";
import ArrowSvg from "./svgs/arrow.svg";

export const PackCreator = () => {
  const router = useRouter();
  const screenRef = useRef<null | HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const { hostGame } = useHostGame();
  const setPackScenes = usePackStore((state) => state.setPackScenes);
  const setVisibleQATypeMenu = usePackStore(
    (state) => state.setVisibleQATypeMenu,
  );
  const packId = router.query.packId as string;
  const { data: pack, isLoading, refetch } = useGetPack(packId, true);

  const packScenes = pack?.scenes;
  const selectedScene = packScenes?.find(
    (scene) => scene.id === selectedSceneId,
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
      (scene) => scene.id === selectedSceneId,
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
        query,
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
    return <Spinner />;
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
          {/* empty-content */}
          <div className="m-auto max-w-[600px] text-center">
            <h1 className="mb-3 text-4xl font-bold">
              Wow it&apos;s a brand new pack!
            </h1>
            <p className="mb-5">Here&apos;s how it works:</p>
            <ul className="list-disc pl-12 text-left">
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
          <ArrowSvg className="absolute bottom-[65px] left-[225px] brightness-50 [&_svg]:h-auto [&_svg]:w-[250px]" />
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
            <div
              className="mb-2 flex items-center justify-between"
              key={binding.display}
            >
              <div>{binding.description}</div>
              <code className="bg-grey-background px-2 py-1 text-[0.9rem] dark:bg-grey-dark">
                {binding.display}
              </code>
            </div>
          ))}
        </HelpModalContent>
      </Modal>
    </Page>
  );
};

const Page = classed.section(
  "h-screen grid bg-grey-background dark:bg-grey-dark grid-cols-[215px_1fr_1fr_100px] grid-rows-[50px_1fr_50px]",
);

const SidebarLeft = classed.section(
  "grid grid-rows-[max-content_auto_max-content] h-full border-r border-grey-dark dark:border-grey-light",
  "col-span-1 row-start-2 row-span-2",
);

const Content = classed.section("p-7 col-start-2 col-span-2 row-start-2");

const EmptyContent = classed(
  Content,
  "flex invisible animate-[visible_0s_linear_0.1s_forwards]",
);

const Screen = classed.section(
  "flex flex-col items-center bg-white dark:bg-black p-5 w-full overflow-auto rounded-wavy border-2",
  "border-grey-dark dark:border-grey-light",
  // screen - top - padding - footer - padding
  "h-[calc(100vh_-_50px_-_40px_-_50px_-_16px)]",
);

const SidebarRight = classed.section(
  "h-full py-7 px-3 col-start-4 col-span-1 row-start-2 row-span-2",
);

const Footer = classed.footer(
  "relative row-start-3 row-span-1 col-start-2 col-span-2",
);

const HelpButton = classed(Button, "fixed bottom-3 right-3 p-2 rounded-full");

const HelpModalContent = classed.div("");
`
  grid-template-areas:
    "header  header  header header"
    "sidebarL content content sidebarR"
    "sidebarL  footer  footer sidebarR";
`;
