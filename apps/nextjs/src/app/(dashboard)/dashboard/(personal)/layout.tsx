import { CreditCardIcon, HomeIcon, SettingsIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { api } from "@/trpc/server";

const pageLinks = [
  {
    id: "home",
    href: "/dashboard",
    label: "Home",
    Icon: HomeIcon,
    exact: true,
  },
  {
    id: "billing",
    href: "/dashboard/billing",
    label: "Billing",
    Icon: CreditCardIcon,
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    label: "Settings",
    Icon: SettingsIcon,
  },
];

const Layout = async ({ children }: React.PropsWithChildren) => {
  const { user, accounts } = await api.account.userWorkspace();

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        homeLink="/dashboard"
        pageLinks={pageLinks}
        user={user}
        accounts={accounts}
      />
      {children}
    </div>
  );
};

export default Layout;
