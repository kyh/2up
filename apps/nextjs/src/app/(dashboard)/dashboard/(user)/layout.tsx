import React from "react";

import { Sidebar } from "@/components/sidebar";
import { getPersonalAccountPageLinks } from "@/config/personal-account-navigation.config";

const Layout = async ({ children }: React.PropsWithChildren) => {
  const pageLinks = getPersonalAccountPageLinks();

  return (
    <div className="flex min-h-dvh">
      <Sidebar pageLinks={pageLinks} />
      {children}
    </div>
  );
};

export default Layout;
