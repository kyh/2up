import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { Navigation } from "features/game/components/Navigation";
import { HomeJoinGamePage } from "features/home/HomeJoinGamePage";
import { HomeSetNamePage } from "features/home/HomeSetNamePage";
import { PageContainer, Card } from "components";

export const HomeRoutes = () => {
  return (
    <>
      <Navigation />
      <PageContainer size="large" align="center">
        <IntroContainer>
          <img src="/logo/logomark.svg" alt="Playhouse" />
          <IntroCard>
            <Switch>
              <Route exact path="/">
                <HomeJoinGamePage />
              </Route>
              <Route exact path="/join">
                <HomeSetNamePage />
              </Route>
            </Switch>
          </IntroCard>
        </IntroContainer>
      </PageContainer>
    </>
  );
};

const IntroContainer = styled.section`
  img {
    display: block;
    width: 60px;
    height: 65px;
    margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
  }
  transform: translateY(-70px);
`;

const IntroCard = styled(Card)`
  height: 260px;
`;
