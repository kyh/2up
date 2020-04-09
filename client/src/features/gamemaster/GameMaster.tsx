import React, { Suspense } from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";
import { GameMasterQuestionsQuery } from "./__generated__/GameMasterQuestionsQuery.graphql";
import { Button } from "components";
import monitor from "./components/monitor.svg";

const QuestionsQuery = graphql`
  query GameMasterQuestionsQuery {
    questions {
      id
      content
    }
  }
`;

export const GameMaster = () => {
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
          <QuestionItem>
            <div>
              <div className="instruction">Give a name for this startup</div>
              <h3 className="question">HelloWorld</h3>
            </div>
            <div className="type">Text</div>
          </QuestionItem>
          <QuestionItem>
            <div>
              <div className="instruction">Give a name for this startup</div>
              <h3 className="question">AnotherStartup</h3>
            </div>
            <div className="type">Text</div>
          </QuestionItem>
          <QuestionItem>
            <div>
              <div className="instruction">Give a name for this startup</div>
              <h3 className="question">WorldWarZ</h3>
            </div>
            <div className="type">Text</div>
          </QuestionItem>
        </SidebarContent>
        <SidebarFooter>
          <Button>Add new question</Button>
        </SidebarFooter>
      </Sidebar>
      <Content>
        <Monitor>
          <h3>Whats the capital of France?</h3>
        </Monitor>
      </Content>
      <Footer />
    </Page>
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
  grid-template-rows: 50px 1fr 100px;
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

const SidebarContent = styled.section``;

const SidebarFooter = styled.footer`
  padding: ${({ theme }) => theme.spacings(3)} 0;
`;

const QuestionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacings(3)};
  border: 2px dotted ${({ theme }) => theme.colors.lightGrey};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-bottom: ${({ theme }) => theme.spacings(3)};

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
  background-size: 100%;
  padding: 3% 3% 18%;
  text-align: center;
`;

const Footer = styled.footer`
  grid-area: footer;
`;
