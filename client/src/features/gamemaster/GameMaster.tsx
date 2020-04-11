import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "components";
import { EditableQuestion } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import monitor from "./components/monitor.svg";

type Act = {
  id: string;
  questionType: string;
  instruction: string;
  question: string;
  answerType: string;
};

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    questionType: "TEXT",
    instruction: `instruction`,
    question: `question ${k}?`,
    answerType: "TEXT",
  }));

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const GameMaster = () => {
  const [acts, setActs] = useState<Act[]>(getItems(10));
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);

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

  const onUpdateAct = (act: Act) => {
    setSelectedAct(act);
    setActs(
      acts.map((a) => {
        if (a.id === act.id) return act;
        return a;
      })
    );
  };

  return (
    <Page>
      <Header>
        <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
      </Header>
      <Sidebar>
        <SidebarHeader>
          <h3>Questions:</h3>
        </SidebarHeader>
        <SidebarContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => (
                <SidebarContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {acts.map((act, index) => (
                    <Draggable key={act.id} draggableId={act.id} index={index}>
                      {(provided: any) => (
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
                            <h3 className="question">{act.question}</h3>
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
          <Button>Add new question</Button>
        </SidebarFooter>
      </Sidebar>
      <Content>
        <Monitor>
          <MonitorScreen>
            {!!selectedAct && (
              <MonitorContent act={selectedAct} onUpdateAct={onUpdateAct} />
            )}
          </MonitorScreen>
        </Monitor>
      </Content>
      <Footer>
        <QuestionTemplate />
        <QuestionTemplate />
        <QuestionTemplate />
      </Footer>
    </Page>
  );
};

const MonitorContent: React.FC<{
  act: Act;
  onUpdateAct: (_act: Act) => void;
}> = ({ act, onUpdateAct }) => {
  const [editableAct, setEditableAct] = useState(act);

  useEffect(() => {
    setEditableAct(act);
  }, [act]);

  const onChange = (newActInfo: Act) => {
    setEditableAct({ ...editableAct, ...newActInfo });
  };

  const onSaveChanges = () => {
    console.log("save changes", editableAct);
    onUpdateAct(editableAct);
  };

  return (
    <>
      <EditableQuestion
        instruction={editableAct.instruction}
        question={editableAct.question}
        questionType={editableAct.questionType}
        onChange={onChange}
        onSaveChanges={onSaveChanges}
      />
      <Answer
        answer=""
        answerType={act.answerType}
        submitted={false}
        onSubmit={() => {}}
      />
    </>
  );
};

const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "sidebar content content"
    "sidebar  footer  footer";
  grid-template-columns: 345px 1fr 1fr;
  grid-template-rows: 50px 1fr 150px;
`;

const Header = styled.section`
  position: relative;
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings(3)};
  background: ${({ theme }) => theme.ui.background};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  .logo {
    height: 35px;
  }
`;

const Sidebar = styled.section`
  grid-area: sidebar;
  background: ${({ theme }) => theme.ui.background};
  padding: 0 ${({ theme }) => theme.spacings(3)};
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100%;
`;

const SidebarHeader = styled.header``;

const SidebarContent = styled.section`
  overflow: auto;
`;

const SidebarFooter = styled.footer`
  padding: ${({ theme }) => theme.spacings(3)} 0;
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
    border: 2px solid ${({ theme }) => theme.ui.modal.border};
    border-radius: ${({ theme }) => theme.border.wavyRadius};
  }
`;

const Content = styled.section`
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacings(3)};
`;

const Monitor = styled.section`
  background-image: url(${monitor});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 30px 20px 137px;
  width: 70%;
  height: 70%;
  display: flex;
  justify-content: center;
`;

const MonitorScreen = styled.section`
  position: relative;
  text-align: center;
  background-color: ${({ theme }) => theme.ui.background};
  width: 100%;
  max-width: 445px;
  transform: translateX(-2px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Footer = styled.footer`
  grid-area: footer;
  display: flex;
  padding: ${({ theme }) => theme.spacings(4)};
`;

const QuestionTemplate = styled.div`
  width: 150px;
  background: ${({ theme }) => theme.ui.background};
  height: 100%;
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-right: ${({ theme }) => theme.spacings(4)};
`;
