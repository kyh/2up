import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getInitials } from "@init/api/lib/user-utils";
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
import { Logo } from "@init/ui/logo";
import {
  BellIcon,
  DashboardIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import type { User } from "@supabase/auth-helpers-nextjs";
import { signOut } from "@/app/(auth)/actions";
import { NavLink, NavSearchButton } from "@/components/nav";
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
    <div className="flex min-h-dvh">
      <Sidebar user={data.user} />
      {children}
    </div>
  );
};

export default Layout;

const navLinks = [
  { id: "crud", href: "/dashboard", label: "CRUD", Icon: DashboardIcon },
  { id: "search", Component: NavSearchButton },
  { id: "activity", href: "/activity", label: "Activity", Icon: BellIcon },
  { id: "docs", href: "/docs", label: "Docs", Icon: QuestionMarkCircledIcon },
] as const;

const navLinksClassName = "group flex flex-col items-center gap-1 p-2 text-xs";
const navLinksIconContainerClassName =
  "h-9 w-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary";

const Sidebar = ({ user }: { user: User }) => {
  const userImage = user.user_metadata.image ?? "";
  const userName = user.user_metadata.name ?? "unknown";

  return (
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
        {navLinks.map((link) => {
          if ("href" in link) {
            return (
              <NavLink
                key={link.id}
                href={link.href}
                className={navLinksClassName}
              >
                <span className={navLinksIconContainerClassName}>
                  <link.Icon width={16} height={16} />
                </span>
                <span>{link.label}</span>
              </NavLink>
            );
          }

          return (
            <link.Component
              key={link.id}
              className={navLinksClassName}
              iconContainerClassName={navLinksIconContainerClassName}
            />
          );
        })}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative mt-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          forceMount
          alignOffset={8}
          sideOffset={8}
          collisionPadding={8}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/account">
                Account
                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/billing">
                Billing
                <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/teams">
                Team
                <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
              </Link>
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
