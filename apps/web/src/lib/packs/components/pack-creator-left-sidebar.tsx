"use client";

import { useEffect, useState, useRef } from "react";
import { classed } from "@/lib/utils/classed";
import { motion } from "framer-motion";
import { useHotkeys } from "@react-hook/hotkey";
import { Button, Icon } from "@/components";
import { Instruction } from "@/lib/game/components/instruction";
import { Question } from "@/lib/game/components/question";
import { Answer } from "@/lib/game/components/answer";
import { keybindings } from "@/lib/packs/pack-utils";
import { useCreateScene, useDeleteScene } from "@/lib/packs/use-scene-actions";
import { CsvImportButton } from "@/lib/packs/components/pack-csv-import";
import { Scene as SceneModel } from "@prisma/client";

type Props = {
  packId: string;
  packScenes: SceneModel[];
  selectedSceneId?: string;
  selectScene: (sceneId: string) => void;
  refetch: () => void;
};

export const Sidebar = ({
  packId,
  packScenes,
  selectedSceneId,
  selectScene,
  refetch,
}: Props) => {
  const { createScene } = useCreateScene();
  const { deleteScene } = useDeleteScene();
  const [scenes, setScenes] = useState(packScenes);
  const draggingRef = useRef(false);

  // Remove this and just use packScenes
  useEffect(() => {
    if (draggingRef.current) return;
    if (JSON.stringify(scenes) !== JSON.stringify(packScenes)) {
      setScenes(packScenes);
    }
  }, [packScenes]);

  const onDeleteScene = async (sceneId: string, index: number) => {
    const deletedScene = await deleteScene(sceneId, index);
    if (deletedScene) {
      await refetch();
      if (sceneId === selectedSceneId) {
        const prev = scenes[index - 1];
        const next = scenes[index + 1];
        if (prev) {
          selectScene(prev.id);
        } else if (next) {
          selectScene(next.id);
        }
      }
    }
  };

  const onCreateScene = async () => {
    const selectedScene = scenes.find((s) => s.id === selectedSceneId);
    const order = (scenes?.length || 0) + 1;
    const newScene = await createScene(packId, order, selectedScene);
    await refetch();
    if (newScene) {
      selectScene(newScene.id);
    }
  };

  useHotkeys(typeof window !== "undefined" ? window : null, [
    [keybindings.addNewScene.hotkey, onCreateScene],
  ]);

  return (
    <>
      <SidebarHeader />
      <SidebarContent>
        {scenes.map((scene, index) => {
          return (
            <SidebarItem
              key={scene.id}
              index={index}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              selectScene={selectScene}
              onDeleteScene={onDeleteScene}
              showDelete={scenes.length > 1}
            />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={onCreateScene} fullWidth>
          Add New Scene
        </Button>
        <CsvImportButton packId={packId} scenes={scenes} refetch={refetch} />
      </SidebarFooter>
    </>
  );
};

const SidebarHeader = classed.header(
  "flex justify-between items-center mb-3 [&_h3]:m-0",
);

const SidebarContent = classed.ul("overflow-auto pr-3 m-0");

const SidebarFooter = classed.footer("p-3");

type SidebarItemProps = {
  index: number;
  scene: any;
  isSelected: boolean;
  selectScene: (sceneId: string) => any;
  onDeleteScene: (sceneId: string, index: number) => any;
  showDelete: boolean;
};

const SidebarItem = ({
  scene,
  index,
  isSelected,
  selectScene,
  onDeleteScene,
  showDelete,
}: SidebarItemProps) => {
  return (
    <QuestionItemContainer>
      <QuestionItem
        isSelected={isSelected}
        onClick={() => selectScene(scene.id)}
      >
        <QuestionPreview>
          <Instruction
            className="mb-1 h-auto"
            instruction={scene.questionDescription || ""}
          />
          <Question
            question={scene.question}
            questionType={scene.questionType.slug}
            displayMode
          />
          <div className="answers-container">
            {scene.sceneAnswers?.map((sceneAnswer: any) => {
              if (!sceneAnswer) return null;
              return (
                <Answer
                  key={sceneAnswer.id}
                  sceneAnswer={{
                    id: sceneAnswer.id,
                    content: sceneAnswer.content || "",
                    isCorrect: sceneAnswer.isCorrect,
                  }}
                  answerType={scene.answerType.slug}
                  onSubmit={() => {}}
                  submitted
                  displayMode
                />
              );
            })}
          </div>
        </QuestionPreview>
        {/* delete */}
        {showDelete && (
          <button
            className="absolute -right-1 -top-1 hidden hover:block"
            onClick={() => onDeleteScene(scene.id, index)}
          >
            <Icon icon="trash" />
          </button>
        )}
      </QuestionItem>
    </QuestionItemContainer>
  );
};

const QuestionItemContainer = classed(motion.li, "py-1");

const QuestionItem = classed.div(
  "relative rounded-r-[5px] p-2 pl-6 transition-[background_0.2s_ease,_box-shadow_0.2s_ease]",
  {
    variants: {
      isSelected: {
        true: "bg-purple-background dark:bg-purple-dark shadow-[inset_4px_0_0_0] shadow-purple",
        false: "",
      },
    },
    defaultVariants: {
      isSelected: "false",
    },
  },
);

const QuestionPreview = classed.div(
  "cursor-pointer text-[0.4rem] p-2 rounded-wavy hover:shadow-[0_0_3px_0] hover:shadow-purple",
  "bg-white dark:bg-black flex flex-col justify-center items-center border border-grey-dark dark:border-grey-light",
  "transition-[border-color_0.1s_ease,_box-shadow_0.1s_ease] child:pointer-events-none",
  "[&_.question]:h-auto [&_.question]:mx-auto [&_.question]:mb-2 [&_.question_h1]:text-[0.7rem]",
  "[&_.question_img]:object-contain [&_.question_img]:max-w-[70px] [&_.question_img]:h-10 [&_.question_img]:block",
  "[&_.video-player]:!w-[70px] [&_.video-player]:!h-[70px]",
  "[&_.audio-player]:scale-50 [&_.audio-player]:origin-[75px] [&_.audio-player]:-my-5 min-w-[auto]",
  "[&_.audio-player_.rhap_additional-controls]:hidden [&_.audio-player_.rhap_volume-controls]:hidden",
  "[&_.answers-container]:grid [&_.answers-container]:grid-cols-2 [&_.answers-container]:gap-1",
  "[&_.answer-display]:text-[0.4rem] [&_.answer-display]:py-1 [&_.answer-display]:px-2 [&_.answer-display]:max-w-[70px]",
  "[&_.answer-display]:overflow-hidden [&_.answer-display]:text-ellipsis [&_.answer-display]:whitespace-nowrap",
  "[&_.answer-display]:m-0 [&_.answer-display]:rounded-wavy [&_.answer-display]:border-2",
  "[&_.answer-display]:border-grey-dark dark:[&_.answer-display]:border-grey-light",
  "[&_.answer-display.correct]:border-purple",
);
