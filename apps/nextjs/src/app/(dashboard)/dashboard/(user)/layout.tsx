import React from "react";
import { CreditCardIcon, HomeIcon, SettingsIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";

const pageLinks = [
  {
    id: "teams",
    href: "/dashboard",
    label: "Teams",
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
] as const;

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-dvh">
      <Sidebar pageLinks={pageLinks} />
      {children}
    </div>
  );
};

export default Layout;
