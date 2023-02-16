import { ReactNode } from "react";
import { classed } from "@tw-classed/react";
import { PageContainer } from "~/lib/home/components/Page";

export const AuthLayout = ({
  children,
  bgImage,
}: {
  children: ReactNode;
  bgImage: "crown" | "glasses";
}) => {
  return (
    <Page size="full" bgImage={bgImage}>
      {children}
    </Page>
  );
};

const Page = classed(
    PageContainer,
    "items-center, h-screen bg-grey-background dark:bg-grey-dark bg-no-repeat", {
      variants:{
        bgImage: {
          crown: "bg-crown bg-[23%_102%]",
          glasses: "bg-glasses bg-[78%_102%]"
        }
      },
      defaultVariants: {
        bgImage: "glasses"
      }
    }
  );
