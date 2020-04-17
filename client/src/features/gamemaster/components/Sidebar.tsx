import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Button } from "components";
import { Act } from "features/gamemaster/PackEditPage";
import { generateUuid } from "utils/stringUtils";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type Props = {
  acts: Act[];
  setActs: (_acts: Act[]) => void;
  selectedAct: Act;
  setSelectedAct: (_act: Act) => void;
};

export const Sidebar: React.FC<Props> = ({
  acts,
  setActs,
  selectedAct,
  setSelectedAct,
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const orderedActs = reorder(
      acts,
      result.source.index,
      result.destination.index
    );

    setActs(orderedActs);
  };

  const onSelectAct = (act: Act) => {
    setSelectedAct(act);
  };

  const addNewAct = () => {
    const newAct = { ...selectedAct, id: generateUuid() };
    setActs([...acts, newAct]);
    setSelectedAct(newAct);
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Questions:</h3>
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
                        onClick={() => onSelectAct(act)}
                      >
                        <div>
                          <div className="instruction">{act.instruction}</div>
                          <ActQuestion
                            questionType={act.questionType}
                            question={act.question}
                          />
                        </div>
                        <div className="type">{act.questionType}</div>
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

const SidebarHeader = styled.header``;

const SidebarContent = styled.section`
  overflow: auto;
`;

const SidebarFooter = styled.footer`
  padding: ${({ theme }) => theme.spacings(3)} 0 0;
`;

const QuestionItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacings(3)};
  border: 2px dotted ${({ theme }) => theme.colors.lightGrey};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-bottom: ${({ theme }) => theme.spacings(3)};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.ui.backgroundGrey : theme.ui.background};

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
`;
