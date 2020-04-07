import React from "react";
import { Route } from "react-router-dom";
import { PageContainer } from "components";

import { ActList } from "features/gamemaster/ActList";
import { ActNew } from "features/gamemaster/ActNew";
import { ActEdit } from "features/gamemaster/ActEdit";
import { PackList } from "features/gamemaster/PackList";
import { PackNew } from "features/gamemaster/PackNew";
import { PackEdit } from "features/gamemaster/PackEdit";
import { PlayList } from "features/gamemaster/PlayList";
import { PlayNew } from "features/gamemaster/PlayNew";
import { PlayEdit } from "features/gamemaster/PlayEdit";
import { QuestionList } from "features/gamemaster/QuestionList";
import { QuestionNew } from "features/gamemaster/QuestionNew";
import { QuestionEdit } from "features/gamemaster/QuestionEdit";
import { GameMaster } from "features/gamemaster/GameMaster";

export const GameMasterRoutes = () => {
  return (
    <>
      <Route exact path="/gamemaster">
        <PageContainer size="large" align="center">
          <GameMaster />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/acts">
        <PageContainer size="large">
          <ActList />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/acts/new">
        <PageContainer size="large">
          <ActNew />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/acts/edit">
        <PageContainer size="large">
          <ActEdit />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/packs">
        <PageContainer size="large">
          <PackList />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/packs/new">
        <PageContainer size="large">
          <PackNew />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/packs/edit">
        <PageContainer size="large">
          <PackEdit />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/plays">
        <PageContainer size="large">
          <PlayList />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/plays/new">
        <PageContainer size="large">
          <PlayNew />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/plays/edit">
        <PageContainer size="large">
          <PlayEdit />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/questions">
        <PageContainer size="large">
          <QuestionList />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/questions/new">
        <PageContainer size="large">
          <QuestionNew />
        </PageContainer>
      </Route>
      <Route exact path="/gamemaster/questions/edit">
        <PageContainer size="large">
          <QuestionEdit />
        </PageContainer>
      </Route>
    </>
  );
};
