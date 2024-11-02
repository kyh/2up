"use client";

import { useState } from "react";
import { Logo } from "@init/ui/logo";
import { LayoutDashboardIcon, Users2Icon } from "lucide-react";

import {
  CreateTeamDialog,
  UserDropdown,
} from "@/app/(dashboard)/_components/sidebar";
import { NavLink } from "@/components/nav";

export const Sidebar = () => {
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);

  const rootUrl = `/admin`;

  const pageLinks = [
    {
      href: rootUrl,
      label: "Home",
      exact: true,
      icon: LayoutDashboardIcon,
    },
    {
      href: `${rootUrl}/teams`,
      label: "Teams",
      icon: Users2Icon,
    },
  ];

  return (
    <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
      <div className="flex flex-col">
        <div className="flex justify-center pb-2">
          <NavLink href={rootUrl}>
            <Logo className="size-10 rounded-lg bg-muted text-primary" />
            <span className="sr-only">Init</span>
          </NavLink>
        </div>
        {pageLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            exact={link.exact}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <link.icon className="size-4" />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <UserDropdown setIsCreateTeamDialogOpen={setIsCreateTeamDialogOpen} />
      <CreateTeamDialog
        open={isCreateTeamDialogOpen}
        onOpenChange={setIsCreateTeamDialogOpen}
      />
    </nav>
  );
};
