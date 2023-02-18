import { ReactNode } from "react";
import { Navigation } from "./components/Navigation";
import { Page } from "./components/Page";

export const PackLayout = ({
  children,
  bgImage,
  bgTop,
}: {
  children: ReactNode;
  bgImage?: string;
  bgTop?: string;
}) => {
  return (
    <Page
      bgImage={bgImage!==undefined}
      style={{
        "--pageBgImage": `url(${bgImage})`,
        "--pageBgTop": `${bgTop || "0"}`
      } as React.CSSProperties
      }
    >
      <Navigation />
      {children}
    </Page>
  );
};
