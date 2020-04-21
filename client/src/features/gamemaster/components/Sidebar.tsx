import React from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { Button, Icon } from "components";
import { useAlert } from "react-alert";
import { Act } from "features/gamemaster/PackCreatorPage";

import { SidebarActCreateMutation } from "./__generated__/SidebarActCreateMutation.graphql";
import graphql from "babel-plugin-relay/macro";
import { useMutation } from "utils/useMutation";
import { ConnectionHandler } from "relay-runtime";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type Props = {
  acts: Act[];
  packId: string;
  selectedAct?: Act;
  setSelectedAct(act: Act): void;
};

const actCreateMutation = graphql`
  mutation SidebarActCreateMutation($input: ActCreateInput!) {
    actCreate(input: $input) {
      act {
        id
        question
        answer
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

export const Sidebar: React.FC<Props> = ({
  packId,
  acts,
  selectedAct,
  setSelectedAct,
}) => {
  const alert = useAlert();
  const [actCreate, isCreatingAct] = useMutation<SidebarActCreateMutation>(
    actCreateMutation
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const orderedActs = reorder(
      acts,
      result.source.index,
      result.destination.index
    );

    // TODO: update order with mutation
    // setActs(orderedActs);
  };

  const deleteAct = (act: Act) => {
    // TODO: delete act mutation
    if (acts.length > 1) {
      // setActs(acts.filter((a) => a.id !== act.id));
      // if (selectedAct.id === act.id) {
      //   setSelectedAct(acts[0]);
      // }
    }
  };

  const selectAct = (act: Act) => {
    setSelectedAct(act);
  };

  const addNewAct = () => {
    actCreate({
      variables: {
        input: {
          packId,
          // TODO: Remove hard coded values
          order: acts.length + 1,
          question: "hi",
          answer: "hey",
          questionTypeId: "UXVlc3Rpb25UeXBlOjE=",
          answerTypeId: "QW5zd2VyVHlwZToz",
        },
      },
      updater: (store) => {
        const payload = store.getRootField("actCreate");
        const act = payload?.getLinkedRecord("act");
        const pack = store.get(packId);

        if (pack) {
          const acts = ConnectionHandler.getConnection(
            pack,
            "PackCreatorPage_acts"
          );

          if (acts) {
            const edge = ConnectionHandler.createEdge(
              store,
              acts,
              act,
              "ActEdge"
            );

            // TODO: Handle different order case
            ConnectionHandler.insertEdgeAfter(acts, edge);
          }
        }
      },
      onCompleted: (data) => {
        console.log("data", data);
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Questions:</h3>
        <Button>
          <Icon icon="list" size="sm" />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <SidebarContent
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {acts.map((act, index) => (
                  <Draggable key={act.id} draggableId={act.id} index={index}>
                    {(provided) => (
                      <QuestionItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isSelected={selectedAct?.id === act.id}
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
                ))}
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
