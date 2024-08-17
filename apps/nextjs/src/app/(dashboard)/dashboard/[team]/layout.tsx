import React from "react";
import { redirect } from "next/navigation";
import {
  CreditCardIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

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
      Icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      id: "members",
      href: `${prefix}/members`,
      label: "Members",
      Icon: UsersIcon,
    },
    {
      id: "billing",
      href: `${prefix}/billing`,
      label: "Billing",
      Icon: CreditCardIcon,
    },
    {
      id: "settings",
      href: `${prefix}/settings`,
      label: "Settings",
      Icon: SettingsIcon,
    },
  ];
};

const Layout = async ({
  children,
  params,
}: React.PropsWithChildren<{ params: Params }>) => {
  const { user, account, accounts } = await api.account.userWorkspace();
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
        email={user.email}
        account={account}
        accounts={accounts}
      />
      {children}
    </div>
  );
};

export default Layout;
