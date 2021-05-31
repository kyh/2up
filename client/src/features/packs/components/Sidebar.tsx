import { useEffect, useState, useCallback, ReactNode } from "react";
import styled from "styled-components";
import { useAlert } from "react-alert";
import ReactTooltip from "react-tooltip";
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

import { SidebarSceneCreateMutation } from "./__generated__/SidebarSceneCreateMutation";
import { SidebarSceneDeleteMutation } from "./__generated__/SidebarSceneDeleteMutation";
import { SidebarPackSceneUpdateMutation } from "./__generated__/SidebarPackSceneUpdateMutation";
import { SidebarPackFragment } from "./__generated__/SidebarPackFragment";

type Props = {
  pack: SidebarPackFragment;
  selectedSceneId?: string;
  selectScene: (scene: any) => void;
  refetch: () => void;
  setSaving: (saving: boolean) => void;
};

export const Sidebar = ({
  pack,
  selectedSceneId,
  selectScene,
  refetch,
  setSaving,
}: Props) => {
  const alert = useAlert();
  const [sceneCreate] = useMutation<SidebarSceneCreateMutation>(SCENE_CREATE);
  const [sceneDelete] = useMutation<SidebarSceneDeleteMutation>(SCENE_DELETE);
  const [packSceneUpdate] = useMutation<SidebarPackSceneUpdateMutation>(
    PACK_SCENE_UPDATE
  );
  const packScenes = pack.scenes?.edges || [];
  const [scenes, setScenes] = useState(packScenes);
  const packId = pack.id;

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

      onDragEnd(scenes[endIndex]?.node?.id, beforeNodeId, afterNodeId);
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
    setSaving(true);
    try {
      await packSceneUpdate({
        variables: {
          input: {
            packId,
            id: sceneId,
            beforeId: beforeSceneId,
            afterId: afterSceneId,
          },
        },
      });
      await refetch();
      setSaving(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  const deleteScene = async (sceneId: string, index: number) => {
    setSaving(true);
    try {
      await sceneDelete({
        variables: {
          input: {
            id: sceneId,
            packId,
          },
        },
      });
      await refetch();
      if (sceneId === selectedSceneId) {
        selectScene(scenes![index - 1]?.node?.id);
      }
      setSaving(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  const addNewScene = async (extendInput = {}) => {
    const defaultInput = {
      packId,
      question: "What's your name?",
      order: (scenes?.length || 0) + 1,
    };
    setSaving(true);

    try {
      const { data } = await sceneCreate({
        variables: { input: { ...defaultInput, ...extendInput } },
      });
      await refetch();
      selectScene(data?.sceneCreate?.scene.id);
      setSaving(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  const quickAddNewScene = () => {
    if (scenes) {
      const selectedScene = scenes.find((s) => s?.node?.id === selectedSceneId)
        ?.node;
      addNewScene({
        instruction: selectedScene?.instruction,
        questionTypeSlug: selectedScene?.questionType.slug,
        question: selectedScene?.question,
        answerTypeSlug: selectedScene?.answerType.slug,
        sceneAnswers: selectedScene?.sceneAnswers,
      });
    }
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Scenes:</h3>
      </SidebarHeader>
      <SidebarContent>
        {scenes?.map((edge, index) => {
          const scene = edge?.node;
          if (!scene) return null;
          return (
            <SidebarItem
              key={scene.id}
              index={index}
              itemProps={itemProps}
              sceneId={scene.id}
              isSelected={selectedSceneId === scene.id}
            >
              <div className="left" onClick={() => selectScene(scene.id)}>
                <div className="type">{scene.questionType.slug}</div>
              </div>
              <div className="right" onClick={() => selectScene(scene.id)}>
                <h3 className="question">{scene.question}</h3>
              </div>
              {scenes.length > 1 && (
                <button
                  className="delete"
                  onClick={() => deleteScene(scene.id, index)}
                >
                  <Icon icon="trash" />
                </button>
              )}
            </SidebarItem>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={addNewScene}>Add New Scene</Button>
        <Button
          onClick={quickAddNewScene}
          data-tip="Quick add"
          disabled={!selectedSceneId}
        >
          +
        </Button>
        <ReactTooltip effect="solid" place="top" />
      </SidebarFooter>
    </SidebarContainer>
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

const PACK_SCENE_UPDATE = gql`
  mutation SidebarPackSceneUpdateMutation($input: PackSceneUpdateInput!) {
    packSceneUpdate(input: $input) {
      packScene {
        id
        order
      }
    }
  }
`;

type SidebarItemProps = {
  index: number;
  sceneId: string;
  isSelected: boolean;
  children: ReactNode;
  itemProps: DynamicListItemProps;
};

const SidebarItem = ({
  index,
  isSelected,
  itemProps,
  children,
}: SidebarItemProps) => {
  const [dragState, ref, eventHandlers] = useDynamicListItem<HTMLLIElement>(
    index,
    "y",
    itemProps
  );

  return (
    <QuestionItem
      layout
      initial={false}
      drag="y"
      ref={ref}
      isSelected={isSelected}
      style={{
        zIndex: getDragStateZIndex(dragState),
        cursor: getDragCursor(dragState),
      }}
      {...eventHandlers}
    >
      {children}
    </QuestionItem>
  );
};

const SidebarContainer = styled.section`
  grid-area: sidebar;
  background: ${theme.ui.background};
  padding: ${theme.spacings(3)};
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100%;
  border-right: 1px solid ${theme.ui.backgroundInverse};
`;

const SidebarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};

  h3 {
    margin: 0;
  }

  button {
    padding: ${theme.spacings(1)};
    min-width: 0;
  }
`;

const SidebarContent = styled.ul`
  overflow: auto;
  padding: 0;
  margin: 0;
  .first-scene-button {
    width: 100%;
    height: 100px;
  }
`;

const SidebarFooter = styled.footer`
  padding: ${theme.spacings(3)} 0 0;
  button {
    min-width: 0;
  }
`;

const QuestionItem = styled(motion.li)<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 2px dotted ${theme.colors.greyLight};
  border-radius: ${theme.ui.borderWavyRadius};
  margin-bottom: ${theme.spacings(3)};
  background-color: ${({ isSelected }) =>
    isSelected ? theme.ui.backgroundGrey : theme.ui.background};

  &:hover .delete {
    display: block;
  }

  .left {
    padding: ${theme.spacings(3)};
  }

  .right {
    width: 100%;
    overflow: hidden;
    padding: ${theme.spacings(3)};
  }

  .question {
    font-size: 24px;
    margin: 0 0 ${theme.spacings(3)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type {
    height: fit-content;
    padding: ${theme.spacings(1)};
    border: 2px solid ${theme.ui.borderColor};
    border-radius: ${theme.ui.borderWavyRadius};
    text-transform: uppercase;
  }

  .delete {
    display: none;
    position: absolute;
    right: ${theme.spacings(2)};
    bottom: ${theme.spacings(2)};
  }
`;
