import type { Metadata } from "next";
import React from "react";

import { Sidebar } from "@/components/sidebar";
import { getPersonalAccountPageLinks } from "@/config/personal-account-navigation.config";
import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  const pageLinks = getPersonalAccountPageLinks();

  return (
    <HydrateClient>
      <div className="flex min-h-dvh">
        <Sidebar pageLinks={pageLinks} />
        {children}
      </div>
    </HydrateClient>
  );
};

export default Layout;
