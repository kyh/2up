import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { getTeamAccountPageLinks } from "@/config/team-account-navigation.config";
import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface Params {
  account: string;
}

const Layout = async ({
  children,
  params,
}: React.PropsWithChildren<{ params: Params }>) => {
  const { account } = await api.team.teamWorkspace({
    slug: params.account,
  });

  if (!account) {
    redirect("/home");
  }

  const pageLinks = getTeamAccountPageLinks(account.slug);

  return (
    <HydrateClient>
      <div className="flex min-h-dvh">
        <Sidebar slug={account.slug} pageLinks={pageLinks} />
        {children}
      </div>
    </HydrateClient>
  );
};

export default Layout;
