import React from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { api } from "@/trpc/server";

type Params = {
  team: string;
};

const getTeamAccountPageLinks = (slug: string) => {
  const prefix = `/dashboard/${slug}`;
  return [
    {
      id: "crud",
      href: prefix,
      label: "CRUD",
      exact: true,
    },
    {
      id: "members",
      href: `${prefix}/members`,
      label: "Members",
    },
    {
      id: "billing",
      href: `${prefix}/billing`,
      label: "Billing",
    },
    {
      id: "settings",
      href: `${prefix}/settings`,
      label: "Settings",
    },
  ];
};

const Layout = async ({
  children,
  params,
}: React.PropsWithChildren<{ params: Params }>) => {
  const { account: teamAccount } = await api.account.teamWorkspace({
    slug: params.team,
  });

  if (!teamAccount) {
    redirect("/dashboard");
  }

  const pageLinks = getTeamAccountPageLinks(teamAccount.slug);

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        homeLink={`/dashboard/${teamAccount.slug}`}
        pageLinks={pageLinks}
        currentAccountSlug={teamAccount.slug}
      />
      {children}
    </div>
  );
};

export default Layout;
