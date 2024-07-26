import React from "react";
import { redirect } from "next/navigation";
import { LayoutDashboardIcon, SettingsIcon, UsersIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { api } from "@/trpc/server";

type Params = {
  account: string;
};

const getTeamAccountPageLinks = (account: string) =>
  [
    {
      id: "crud",
      href: createPath("/dashboard/[account]", account),
      label: "CRUD",
      Icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      id: "members",
      href: createPath("/dashboard/[account]/members", account),
      label: "Members",
      Icon: UsersIcon,
    },
    {
      id: "settings",
      href: createPath("/dashboard/[account]/settings", account),
      label: "Settings",
      Icon: SettingsIcon,
    },
  ] as const;

const createPath = (path: string, account: string) =>
  path.replace("[account]", account);

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
      <Sidebar
        slug={account.slug}
        accountId={account.id}
        pageLinks={pageLinks}
      />
      {children}
    </div>
  );
};

export default Layout;
