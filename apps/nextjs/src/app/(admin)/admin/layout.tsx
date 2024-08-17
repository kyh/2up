import { HomeIcon, Users2Icon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { api } from "@/trpc/server";

const pageLinks = [
  {
    id: "home",
    href: "/admin",
    label: "Home",
    Icon: HomeIcon,
    exact: true,
  },
  {
    id: "accounts",
    href: "/admin/accounts",
    label: "Accounts",
    Icon: Users2Icon,
  },
];

const Layout = async ({ children }: React.PropsWithChildren) => {
  const { user, account, accounts } = await api.account.userWorkspace();

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        homeLink="/dashboard"
        pageLinks={pageLinks}
        email={user.email}
        account={account}
        accounts={accounts}
      />
      {children}
    </div>
  );
};

export default Layout;
