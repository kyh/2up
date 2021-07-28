import { ReactNode } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import { Navigation } from "features/game/components/Navigation";
import { PageContainer } from "features/home/components/Page";
import { Card } from "components";

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <IntroContainer>
          <IntroLogo src="/logo/logomark.svg" alt="Playhouse" />
          <IntroCard>{children}</IntroCard>
        </IntroContainer>
      </PageContainer>
    </>
  );
};

const IntroContainer = styled.section`
  transform: translateY(-70px);
`;

const IntroLogo = styled.img`
  display: block;
  width: 60px;
  height: 65px;
  margin: 0 auto ${theme.spacings(3)};
`;

const IntroCard = styled(Card)`
  height: 260px;
`;
