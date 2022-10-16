import Image from "next/image";
import { ReactNode } from "react";
import styled from "styled-components";
import { theme } from "~/styles/theme";
import { Navigation } from "~/lib/game/components/Navigation";
import { PageContainer } from "~/lib/home/components/Page";
import { Card } from "~/components";

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <IntroContainer>
          <IntroLogoContaier>
            <Image
              src="/logo/logomark.svg"
              alt="Truffles"
              width="60"
              height="65"
            />
          </IntroLogoContaier>
          <IntroCard>{children}</IntroCard>
        </IntroContainer>
      </PageContainer>
    </>
  );
};

const IntroContainer = styled.section`
  transform: translateY(-70px);
`;

const IntroLogoContaier = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacings(3)};
`;

const IntroCard = styled(Card)`
  height: 260px;
`;
