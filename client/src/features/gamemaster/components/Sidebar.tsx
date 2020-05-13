import React, { useState } from "react";
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
import { ActsTableModal } from "features/gamemaster/components/ActsTableModal";

import { SidebarActCreateMutation } from "./__generated__/SidebarActCreateMutation";
import { SidebarActDeleteMutation } from "./__generated__/SidebarActDeleteMutation";
import { SidebarPackFragment } from "./__generated__/SidebarPackFragment";

// const reorder = (list: any[], startIndex: number, endIndex: number) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

type Props = {
  pack: SidebarPackFragment;
  selectedActId: string;
  setSelectedAct(act: any): void;
  refetchActs(): void;
};

const ACT_CREATE = gql`
  mutation SidebarActCreateMutation($input: ActCreateInput!) {
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

const ACT_DELETE = gql`
  mutation SidebarActDeleteMutation($input: ActDeleteInput!) {
    actDelete(input: $input) {
      act {
        id
      }
    }
  }
`;

export const Sidebar = ({
  pack,
  selectedActId,
  setSelectedAct,
  refetchActs,
}: Props) => {
  const alert = useAlert();
  const [tableViewOpen, setTableViewOpen] = useState(false);
  const [actCreate] = useMutation<SidebarActCreateMutation>(ACT_CREATE);
  const [actDelete] = useMutation<SidebarActDeleteMutation>(ACT_DELETE);

  const acts = pack.acts?.edges;
  const packId = pack.id;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // const orderedActs = reorder(
    //   acts,
    //   result.source.index,
    //   result.destination.index
    // );

    // TODO: update order with mutation
    // setActs(orderedActs);
  };

  const deleteAct = async (act: any) => {
    try {
      await actDelete({
        variables: {
          input: {
            id: act.id,
            packId,
          },
        },
      });
      refetchActs();
    } catch (error) {
      alert.show(error);
    }
  };

  const selectAct = (act: any) => {
    setSelectedAct(act.id);
  };

  const addNewAct = async () => {
    await actCreate({
      variables: {
        input: {
          packId,
          question: "Play",
          order: (acts?.length || 0) + 1,
        },
      },
    });
    refetchActs();
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Questions:</h3>
        <Button onClick={() => setTableViewOpen(true)}>
          <Icon icon="list" size="sm" />
        </Button>
        <ActsTableModal
          acts={acts}
          open={tableViewOpen}
          setOpen={(open) => {
            setTableViewOpen(open);
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <SidebarContent
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {acts?.map((edge: any, index: any) => {
                  const act = edge?.node;
                  if (!act) {
                    return;
                  }

                  return (
                    <Draggable key={act.id} draggableId={act.id} index={index}>
                      {(provided) => (
                        <QuestionItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isSelected={selectedActId === act.id}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div className="left" onClick={() => selectAct(act)}>
                            <div className="instruction">{act.instruction}</div>
                            <ActQuestion
                              questionType={act.questionType.slug}
                              question={act.question}
                            />
                          </div>
                          <div className="right" onClick={() => selectAct(act)}>
                            <div className="type">{act.questionType.slug}</div>
                          </div>
                          <button
                            className="delete"
                            onClick={() => deleteAct(act)}
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
        <Button onClick={addNewAct}>Add new question</Button>
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

const ActQuestion: React.FC<{ questionType: string; question: string }> = ({
  questionType,
  question,
}) => {
  switch (questionType) {
    case "image":
      return <img style={{ height: 100 }} src={question} alt="" />;
    default:
      return <h3 className="question">{question}</h3>;
  }
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
    width: 100%;
    padding: ${({ theme }) => theme.spacings(3)};
  }

  .right {
    padding: ${({ theme }) => theme.spacings(3)};
  }

  .instruction {
    color: ${({ theme }) => theme.colors.darkGrey};
    font-size: 14px;
    margin-bottom: ${({ theme }) => theme.spacings(2)};
  }

  .question {
    font-size: 24px;
    margin: 0 0 ${({ theme }) => theme.spacings(3)};
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
