import { ReactNode, useState } from "react";

import { Header } from "~/app/components/Header";

export const HomeLayoutV2 = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="fixed w-screen z-50">
        <Header />
      </div>
      {children}
    </>
  );
};
