import type { Metadata } from "next";
import React from "react";

import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Layout = ({ children }: React.PropsWithChildren) => {
  void api.account.userWorkspace.prefetch();

  return <HydrateClient>{children}</HydrateClient>;
};

export default Layout;
