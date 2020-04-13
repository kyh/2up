import React, { useState } from "react";
import styled from "styled-components";
import { generateUuid } from "utils/stringUtils";
import { Sidebar } from "./components/Sidebar";
import { Header, Page, Content } from "./components/Page";
import { ActPreview } from "./components/ActPreview";
import { Act } from "./types";

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: generateUuid(),
    questionType: "TEXT",
    instruction: `instruction`,
    question: `question ${k}?`,
    answerType: "TEXT",
  }));

export const ActPage = () => {
  const [acts, setActs] = useState<Act[]>(getItems(10));
  const [selectedAct, setSelectedAct] = useState<Act>(acts[0]);

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
      <Header />
      <Sidebar
        acts={acts}
        setActs={setActs}
        selectedAct={selectedAct}
        setSelectedAct={setSelectedAct}
      />
      <Content>
        <ActPreview selectedAct={selectedAct} onUpdateAct={onUpdateAct} />
      </Content>
      <Footer>
        <QuestionTemplate />
        <QuestionTemplate />
        <QuestionTemplate />
      </Footer>
    </Page>
  );
};

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
  border: 2px solid ${({ theme }) => theme.ui.backgroundInverse};
`;
