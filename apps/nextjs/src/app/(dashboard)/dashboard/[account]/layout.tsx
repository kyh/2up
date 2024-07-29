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
  account: string;
};

const getTeamAccountPageLinks = (account: string) => {
  const prefix = `/dashboard/${account}`;
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
  const { user, accounts } = await api.account.userWorkspace();
  const { account } = await api.account.teamWorkspace({
    slug: params.account,
  });

  if (!account) {
    redirect("/dashboard");
  }

  const pageLinks = getTeamAccountPageLinks(account.slug);

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        homeLink={`/dashboard/${account.slug}`}
        pageLinks={pageLinks}
        currentAccountSlug={account.slug}
        user={user}
        accounts={accounts}
      />
      {children}
    </div>
  );
};

export default Layout;
