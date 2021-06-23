import { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { useAlert } from "react-alert";
import { gql, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  useDynamicList,
  useDynamicListItem,
  calculateSwapDistance,
  arrayMove,
  getDragStateZIndex,
  DynamicListItemProps,
  getDragCursor,
} from "styles/animations";
import { theme } from "styles/theme";
import { Button, Icon } from "components";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import { savingSceneVar } from "features/packs/sceneService";

import { SidebarSceneCreateMutation } from "./__generated__/SidebarSceneCreateMutation";
import { SidebarSceneDeleteMutation } from "./__generated__/SidebarSceneDeleteMutation";
import { SidebarSceneOrderUpdateMutation } from "./__generated__/SidebarSceneOrderUpdateMutation";
import {
  SidebarPackFragment,
  SidebarPackFragment_scenes_edges_node,
} from "./__generated__/SidebarPackFragment";

type Props = {
  pack: SidebarPackFragment;
  selectedSceneId?: string;
  selectScene: (scene: any) => void;
  refetch: () => void;
  openCsvImport: () => void;
};

export const Sidebar = ({
  pack,
  selectedSceneId,
  selectScene,
  refetch,
  openCsvImport,
}: Props) => {
  const alert = useAlert();
  const [sceneCreate] = useMutation<SidebarSceneCreateMutation>(SCENE_CREATE);
  const [sceneDelete] = useMutation<SidebarSceneDeleteMutation>(SCENE_DELETE);
  const [sceneOrderUpdate] = useMutation<SidebarSceneOrderUpdateMutation>(
    SCENE_ORDER_UPDATE
  );
  const packScenes = pack.scenes?.edges || [];
  const [scenes, setScenes] = useState(packScenes);
  const [searchQuery, setSearchQuery] = useState("");

  const packId = pack.id;

  // This is pretty gross, we should figure out a better way of handling drag
  // and drop updates.
  useEffect(() => {
    if (JSON.stringify(scenes) !== JSON.stringify(packScenes)) {
      setScenes(packScenes);
    }
  }, [packScenes]);

  const onPositionUpdate = useCallback(
    (startIndex: number, endIndex: number) => {
      const newOrder = arrayMove(scenes, startIndex, endIndex);
      setScenes(newOrder);

      let beforeNodeId;
      let afterNodeId;
      if (endIndex !== 0) beforeNodeId = scenes[endIndex - 1]?.node?.id;
      if (endIndex !== scenes.length - 1)
        afterNodeId = scenes[endIndex + 1]?.node?.id;

      const sceneId = scenes[startIndex]?.node?.id;
      onDragEnd(sceneId, beforeNodeId, afterNodeId);
    },
    [scenes, setScenes]
  );

  const itemProps = useDynamicList({
    items: scenes,
    swapDistance: calculateSwapDistance,
    onPositionUpdate,
  });

  const onDragEnd = async (
    sceneId?: string,
    beforeSceneId?: string,
    afterSceneId?: string
  ) => {
    savingSceneVar(true);
    try {
      await sceneOrderUpdate({
        variables: {
          input: {
            id: sceneId,
            beforeId: beforeSceneId,
            afterId: afterSceneId,
          },
        },
      });
      await refetch();
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  const deleteScene = async (sceneId: string, index: number) => {
    savingSceneVar(true);
    try {
      await sceneDelete({
        variables: {
          input: {
            id: sceneId,
          },
        },
      });
      await refetch();
      if (sceneId === selectedSceneId) {
        selectScene(scenes![index - 1]?.node?.id);
      }
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  const addNewScene = async (extendInput = {}) => {
    const defaultInput = {
      packId,
      question: "Question?",
      questionTypeSlug: "text",
      answerTypeSlug: "text",
      sceneAnswers: [{ content: "Answer!", isCorrect: true }],
      order: (scenes?.length || 0) + 1,
    };
    savingSceneVar(true);

    try {
      const { data } = await sceneCreate({
        variables: { input: { ...defaultInput, ...extendInput } },
      });
      await refetch();
      selectScene(data?.sceneCreate?.scene.id);
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  const quickAddNewScene = () => {
    if (scenes) {
      const selectedScene = scenes.find((s) => s?.node?.id === selectedSceneId)
        ?.node;
      addNewScene(
        selectedScene
          ? {
              instruction: selectedScene.instruction,
              questionTypeSlug: selectedScene.questionType.slug,
              question: selectedScene.question,
              answerTypeSlug: selectedScene.answerType.slug,
              sceneAnswers: selectedScene.sceneAnswers,
            }
          : {}
      );
    }
  };

  const importCsv = () => {
    openCsvImport();
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <SidebarHeader>
        {/* <input
          className="search"
          onChange={onSearch}
          type="text"
          placeholder="Search by answers"
        /> */}
      </SidebarHeader>
      <SidebarContent>
        {scenes?.map((edge, index) => {
          const scene = edge?.node;
          if (!scene) return null;

          const matchedAnswers = (scene?.sceneAnswers || []).filter(
            (sceneAnswer) => {
              return (sceneAnswer?.content || "").includes(searchQuery);
            }
          );

          if (searchQuery !== "" && matchedAnswers.length < 1) {
            return null;
          }

          return (
            <SidebarItem
              key={scene.id}
              index={index}
              itemProps={itemProps}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              selectScene={selectScene}
              deleteScene={deleteScene}
              showDelete={scenes.length > 1}
            />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={quickAddNewScene} fullWidth>
          Add New Scene
        </Button>
        <Button onClick={importCsv} fullWidth>
          CSV Import
        </Button>
      </SidebarFooter>
    </>
  );
};

Sidebar.fragments = {
  pack: gql`
    fragment SidebarPackFragment on Pack {
      id
      scenes(first: 100) {
        edges {
          node {
            id
            question
            order
            sceneAnswers {
              id
              content
              isCorrect
            }
            instruction
            questionType {
              id
              slug
            }
            answerType {
              id
              slug
            }
          }
        }
      }
    }
  `,
};

const SCENE_CREATE = gql`
  mutation SidebarSceneCreateMutation($input: SceneCreateInput!) {
    sceneCreate(input: $input) {
      scene {
        id
        question
        sceneAnswers {
          id
          content
          isCorrect
        }
        instruction
        questionType {
          id
          slug
        }
        answerType {
          id
          slug
        }
      }
    }
  }
`;

const SCENE_DELETE = gql`
  mutation SidebarSceneDeleteMutation($input: SceneDeleteInput!) {
    sceneDelete(input: $input) {
      scene {
        id
      }
    }
  }
`;

const SCENE_ORDER_UPDATE = gql`
  mutation SidebarSceneOrderUpdateMutation($input: SceneOrderUpdateInput!) {
    sceneOrderUpdate(input: $input) {
      scene {
        id
        order
      }
    }
  }
`;

type SidebarItemProps = {
  index: number;
  scene: SidebarPackFragment_scenes_edges_node;
  isSelected: boolean;
  selectScene: (sceneId: string) => any;
  deleteScene: (sceneId: string, index: number) => any;
  showDelete: boolean;
  itemProps: DynamicListItemProps;
};

const SidebarItem = ({
  scene,
  index,
  isSelected,
  selectScene,
  deleteScene,
  showDelete,
  itemProps,
}: SidebarItemProps) => {
  const [dragState, ref, eventHandlers] = useDynamicListItem<HTMLLIElement>(
    index,
    "y",
    itemProps
  );

  return (
    <QuestionItemContainer
      layout
      initial={false}
      drag="y"
      ref={ref}
      style={{
        zIndex: getDragStateZIndex(dragState),
        cursor: getDragCursor(dragState),
      }}
      {...eventHandlers}
    >
      <QuestionItem
        isSelected={isSelected}
        onClick={() => selectScene(scene.id)}
      >
        <div className="preview">
          <Question
            question={scene.question}
            instruction={scene.instruction || ""}
            questionType={scene.questionType.slug}
          />
          <div className="answers-container">
            {scene.sceneAnswers?.map((sceneAnswer) => {
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
                  submitted
                  onSubmit={() => {}}
                  displayMode
                />
              );
            })}
          </div>
        </div>
        {showDelete && (
          <button
            className="delete"
            onClick={() => deleteScene(scene.id, index)}
          >
            <Icon icon="trash" />
          </button>
        )}
      </QuestionItem>
    </QuestionItemContainer>
  );
};

const SidebarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};
  h3 {
    margin: 0;
  }
`;

const SidebarContent = styled.ul`
  isolation: isolate;
  overflow: auto;
  padding: 0 ${theme.spacings(3)} 0 0;
  margin: 0;
`;

const SidebarFooter = styled.footer`
  padding: ${theme.spacings(3)};
`;

const QuestionItemContainer = styled(motion.li)`
  padding: ${theme.spacings(1)} 0;
`;

const QuestionItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: ${theme.spacings(2)};
  padding-left: ${theme.spacings(6)};
  transition: background 0.2s ease, box-shadow 0.2s ease;
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: ${theme.ui.backgroundPurple};
      box-shadow: inset ${theme.spacings(1)} 0 0 0 ${theme.colors.purple};
    `}

  &:hover {
    .delete {
      display: block;
    }
    .preview {
      box-shadow: 0 0 3px 0 ${theme.colors.purple};
      border-color: ${theme.colors.purple};
    }
  }

  .preview {
    cursor: pointer;
    font-size: 0.4rem;
    background: ${theme.ui.background};
    padding: ${theme.spacings(2)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.ui.borderColor};
    border-radius: ${theme.ui.borderWavyRadius};
    transition: border-color 0.1s ease, box-shadow 0.1s ease;
    > div:first-child {
      margin-bottom: ${theme.spacings(1)};
    }
    > img {
      object-fit: contain;
      max-width: 70px;
      height: 40px;
      display: block;
      margin: 0 auto ${theme.spacings(2)};
    }
    > h1 {
      font-size: 0.7rem;
      margin-bottom: ${theme.spacings(2)};
    }
    .answers-container {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      grid-gap: ${theme.spacings(1)};
    }
    .display-text {
      font-size: 0.4rem;
      padding: ${theme.spacings(1)} ${theme.spacings(2)};
    }
    > * {
      pointer-events: none;
    }
  }

  .delete {
    display: none;
    position: absolute;
    right: ${theme.spacings(-1)};
    top: ${theme.spacings(-1)};
  }
`;
