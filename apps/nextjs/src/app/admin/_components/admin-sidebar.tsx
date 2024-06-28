import Link from "next/link";
import { Logo } from "@init/ui/logo";
import { LayoutDashboardIcon, User2Icon } from "lucide-react";

import { NavLink } from "@/components/nav";

export const AdminSidebar = async () => (
  <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
    <div className="flex flex-col">
      <Link href="/dashboard" className="flex justify-center pb-2">
        <Logo
          width={40}
          height={40}
          className="rounded-lg bg-muted text-primary"
        />
        <span className="sr-only">Init</span>
      </Link>
      <NavLink
        href="/admin"
        exact={true}
        className="group flex flex-col items-center gap-1 p-2 text-xs"
      >
        <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
          <LayoutDashboardIcon width={16} height={16} />
        </span>
        <span>Home</span>
      </NavLink>
      <NavLink
        href="/admin/accounts"
        className="group flex flex-col items-center gap-1 p-2 text-xs"
      >
        <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
          <User2Icon width={16} height={16} />
        </span>
        <span>Accounts</span>
      </NavLink>
    </div>
  </nav>
);
