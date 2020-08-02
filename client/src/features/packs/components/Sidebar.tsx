import React from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useAlert } from "react-alert";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { Button, Icon } from "components";

import { SidebarSceneCreateMutation } from "./__generated__/SidebarSceneCreateMutation";
import { SidebarSceneDeleteMutation } from "./__generated__/SidebarSceneDeleteMutation";
import { SidebarPackUpdateMutation } from "./__generated__/SidebarPackUpdateMutation";
import { SidebarPackFragment } from "./__generated__/SidebarPackFragment";

type Props = {
  pack: SidebarPackFragment;
  selectedSceneId?: string;
  selectScene: (scene: any) => void;
  refetch: () => void;
  setSaving: (saving: boolean) => void;
};

const SCENE_CREATE = gql`
  mutation SidebarSceneCreateMutation($input: ActCreateInput!) {
    actCreate(input: $input) {
      act {
        id
        question
        answer
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
  mutation SidebarSceneDeleteMutation($input: ActDeleteInput!) {
    actDelete(input: $input) {
      act {
        id
      }
    }
  }
`;

const PACK_SCENE_UPDATE = gql`
  mutation SidebarPackUpdateMutation($input: PackActUpdateInput!) {
    packActUpdate(input: $input) {
      packAct {
        id
        order
      }
    }
  }
`;

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
  const [packSceneUpdate] = useMutation<SidebarPackUpdateMutation>(
    PACK_SCENE_UPDATE
  );

  const scenes = pack.acts?.edges;
  const packId = pack.id;

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    setSaving(true);
    const destinationIndex = result.destination.index;
    const draggableId = result.draggableId;

    let before;
    let after;
    if (destinationIndex !== 0 && scenes) {
      before = scenes[destinationIndex];
    }
    if (scenes && destinationIndex !== scenes.length - 1) {
      after = scenes[destinationIndex + 1];
    }

    try {
      await packSceneUpdate({
        variables: {
          input: {
            packId,
            id: draggableId,
            beforeId: before?.node?.id,
            afterId: after?.node?.id,
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

  const deleteScene = async (sceneId: string) => {
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
      setSaving(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  const addNewScene = async () => {
    setSaving(true);
    try {
      await sceneCreate({
        variables: {
          input: {
            packId,
            question: "Play",
            order: (scenes?.length || 0) + 1,
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

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Scenes:</h3>
      </SidebarHeader>
      <SidebarContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <SidebarContent
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {scenes?.map((edge: any, index: any) => {
                  const scene = edge?.node;
                  if (!scene) {
                    return;
                  }

                  return (
                    <Draggable
                      key={scene.id}
                      draggableId={scene.id}
                      index={index}
                    >
                      {(provided) => (
                        <QuestionItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isSelected={selectedSceneId === scene.id}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div
                            className="left"
                            onClick={() => selectScene(scene.id)}
                          >
                            <div className="type">
                              {scene.questionType.slug}
                            </div>
                          </div>
                          <div
                            className="right"
                            onClick={() => selectScene(scene.id)}
                          >
                            <div className="instruction">
                              {scene.instruction}
                            </div>
                            <h3 className="question">{scene.question}</h3>
                          </div>
                          <button
                            className="delete"
                            onClick={() => deleteScene(scene.id)}
                          >
                            <Icon icon="trash" />
                          </button>
                        </QuestionItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </SidebarContent>
            )}
          </Droppable>
        </DragDropContext>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={addNewScene}>Add New Scene</Button>
      </SidebarFooter>
    </SidebarContainer>
  );
};

Sidebar.fragments = {
  pack: gql`
    fragment SidebarPackFragment on Pack {
      id
      acts(first: 100) {
        edges {
          node {
            id
            question
            answer
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

const SidebarContainer = styled.section`
  grid-area: sidebar;
  background: ${({ theme }) => theme.ui.background};
  padding: ${({ theme }) => theme.spacings(3)};
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.ui.backgroundInverse};
`;

const SidebarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacings(3)};

  h3 {
    margin: 0;
  }

  button {
    padding: ${({ theme }) => theme.spacings(1)};
    min-width: 0;
  }
`;

const SidebarContent = styled.section`
  overflow: auto;
`;

const SidebarFooter = styled.footer`
  padding: ${({ theme }) => theme.spacings(3)} 0 0;
`;

const QuestionItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 2px dotted ${({ theme }) => theme.colors.lightGrey};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-bottom: ${({ theme }) => theme.spacings(3)};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.ui.backgroundGrey : theme.ui.background};

  &:hover .delete {
    display: block;
  }

  .left {
    padding: ${({ theme }) => theme.spacings(3)};
  }

  .right {
    width: 100%;
    overflow: hidden;
    padding: ${({ theme }) => theme.spacings(3)};
  }

  .instruction {
    color: ${({ theme }) => theme.colors.darkGrey};
    font-size: 14px;
    margin-bottom: ${({ theme }) => theme.spacings(2)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question {
    font-size: 24px;
    margin: 0 0 ${({ theme }) => theme.spacings(3)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type {
    height: fit-content;
    padding: ${({ theme }) => theme.spacings(1)};
    border: 2px solid ${({ theme }) => theme.border.color};
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    text-transform: uppercase;
  }

  .delete {
    display: none;
    position: absolute;
    right: ${({ theme }) => theme.spacings(2)};
    bottom: ${({ theme }) => theme.spacings(2)};
  }
`;
