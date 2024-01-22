import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  BellIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  UsersIcon,
} from "lucide-react";

import type { User } from "@supabase/auth-helpers-nextjs";
import { signOut } from "@/app/(auth)/actions";
import { createRedirectUrl } from "@/lib/url";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Authenticated pages.",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const pathname = headers().get("x-pathname");
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data } = await supabase.auth.getUser();

  // Redirect to login page if the user is not authenticated
  if (!data.user) {
    return redirect(createRedirectUrl("/auth/login", pathname ?? "/"));
  }

  return (
    <section className="flex min-h-dvh">
      <Sidebar user={data.user} />
      {children}
    </section>
  );
};

export default Layout;

const navLinks = [
  { href: "/dashboard", label: "Home", icon: <LayoutGridIcon size={20} /> },
  { href: "/dashboard/teams", label: "Teams", icon: <UsersIcon size={20} /> },
  {
    href: "/dashboard/activity",
    label: "Activity",
    icon: <BellIcon size={20} />,
  },
  { href: "/docs", label: "Docs", icon: <HelpCircleIcon size={20} /> },
];

const Sidebar = ({ user }: { user: User }) => {
  return (
    <nav className="flex w-[70px] flex-col items-center overflow-y-auto overflow-x-hidden bg-zinc-900 p-3">
      {navLinks.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col items-center py-2 text-xs"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg transition group-hover:bg-secondary">
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative mt-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.user_metadata.image ?? ""}
                alt={user.user_metadata.name ?? "unknown"}
              />
              <AvatarFallback>KH</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Kaiyu</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem className="w-full" asChild>
              <button>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
