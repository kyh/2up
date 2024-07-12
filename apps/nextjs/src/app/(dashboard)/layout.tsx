import type { Metadata } from "next";
import React from "react";

import { HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  return <HydrateClient>{children}</HydrateClient>;
};

export default Layout;
