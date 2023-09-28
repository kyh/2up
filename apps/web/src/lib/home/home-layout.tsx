import Image from "next/image";
import { ReactNode } from "react";
import { classed } from "~/utils/classed";
import { Navigation } from "~/lib/game/components/navigation";
import { PageContainer } from "~/lib/home/components/page";
import { Card } from "~/components";

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <IntroContainer>
          <IntroLogoContaier>
            <Image src="/logo/logomark.svg" alt="2up" width="60" height="65" />
          </IntroLogoContaier>
          <IntroCard>{children}</IntroCard>
        </IntroContainer>
      </PageContainer>
    </>
  );
};

const IntroContainer = classed.section("translate-y-[-70px]");

const IntroLogoContaier = classed.div("flex justify-center mb-3");

const IntroCard = classed(Card, "h-[260px]");
