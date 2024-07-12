import React from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { getTeamAccountPageLinks } from "@/config/team-account-navigation.config";
import { api } from "@/trpc/server";

type Params = {
  account: string;
};

const Layout = async ({
  children,
  params,
}: React.PropsWithChildren<{ params: Params }>) => {
  const { account } = await api.team.teamWorkspace({
    slug: params.account,
  });

  if (!account) {
    redirect("/dashboard");
  }

  const pageLinks = getTeamAccountPageLinks(account.slug);

  return (
    <div className="flex min-h-dvh">
      <Sidebar slug={account.slug} pageLinks={pageLinks} />
      {children}
    </div>
  );
};

export default Layout;
