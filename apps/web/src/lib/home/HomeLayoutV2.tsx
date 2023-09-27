import { ReactNode, useState } from "react";

import { Header } from "~/components/Header/Header";

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
