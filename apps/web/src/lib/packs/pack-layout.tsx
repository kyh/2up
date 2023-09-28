import { ReactNode } from "react";
import { Navigation } from "./components/navigation";
import { Page } from "./components/page";

export const PackLayout = ({
  children,
  bgImage,
  bgTop,
}: {
  children: ReactNode;
  bgImage?: boolean;
  bgTop?: string;
}) => {
  return (
    <Page
      bgImage={bgImage !== undefined}
      style={{ "--pageBgTop": `${bgTop || "0"}` } as React.CSSProperties}
    >
      <Navigation />
      {children}
    </Page>
  );
};
