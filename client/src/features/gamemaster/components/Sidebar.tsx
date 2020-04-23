import React, { useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { Button, Icon } from "components";
import { useAlert } from "react-alert";
import { ActsTableModal } from "features/gamemaster/components/ActsTableModal";

import graphql from "babel-plugin-relay/macro";
import { SidebarActCreateMutation } from "./__generated__/SidebarActCreateMutation.graphql";
import { useMutation } from "utils/useMutation";
import { useFragment } from "react-relay/hooks";
import { ConnectionHandler } from "relay-runtime";
import { Sidebar_pack$key } from "./__generated__/Sidebar_pack.graphql";

// const reorder = (list: any[], startIndex: number, endIndex: number) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

type Props = {
  pack: Sidebar_pack$key;
  selectedAct?: any;
  setSelectedAct(act: any): void;
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
  pack,
  selectedAct,
  setSelectedAct,
}) => {
  const alert = useAlert();
  const [tableViewOpen, setTableViewOpen] = useState(false);
  const [actCreate, isCreatingAct] = useMutation<SidebarActCreateMutation>(
    actCreateMutation
  );

  const data = useFragment(
    graphql`
      fragment Sidebar_pack on Pack {
        id
        acts(first: 100) @connection(key: "PackCreatorPage_acts", filters: []) {
          edges {
            node {
              id
              answer
              question
              questionType {
                slug
              }
              answerType {
                slug
              }
            }
          }
        }
      }
    `,
    pack
  );

  const acts = data?.acts?.edges;
  const packId = data.id;

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

  const deleteAct = (act: any) => {
    // TODO: delete act mutation
    // if (acts.length > 1) {
    // setActs(acts.filter((a) => a.id !== act.id));
    // if (selectedAct.id === act.id) {
    //   setSelectedAct(acts[0]);
    // }
    // }
  };

  const selectAct = (act: any) => {
    setSelectedAct(act.id);
  };

  const addNewAct = () => {
    actCreate({
      variables: {
        input: {
          packId,
          // TODO: Remove hard coded values
          order: 1,
          question: "hi",
          answer: "hey",
          questionTypeId: "UXVlc3Rpb25UeXBlOjE=",
          answerTypeId: "QW5zd2VyVHlwZToz",
        },
      },
      updater: (store) => {
        const payload = store.getRootField("actCreate");
        const act = payload?.getLinkedRecord("act");
        const pack = store.get(packId)!;
        const acts = ConnectionHandler.getConnection(
          pack,
          "PackCreatorPage_acts"
        )!;
        const edge = ConnectionHandler.createEdge(store, acts, act, "ActEdge");
        // TODO: Handle different order case
        ConnectionHandler.insertEdgeAfter(acts, edge);
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
                {acts?.map((edge, index) => {
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
                          isSelected={selectedAct?.id === act.id}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div className="left" onClick={() => selectAct(act)}>
                            {/* <div className="instruction">{act.instruction}</div> */}
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
        <Button onClick={addNewAct} disabled={isCreatingAct}>
          Add new question
        </Button>
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
