import type { Metadata } from "next";
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
import { Logo } from "@init/ui/logo";
import { getInitials } from "@init/ui/utils";

import type { RouterOutputs } from "@init/api";
import { NavLink } from "@/components/nav";
import { accountPageLinks, dashboardPageLinks } from "@/lib/page-links";
import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await api.account.userWorkspace();

  return (
    <HydrateClient>
      <div className="flex min-h-dvh">
        <Sidebar user={data.user} />
        {children}
      </div>
    </HydrateClient>
  );
};

export default Layout;

const Sidebar = ({
  user,
}: {
  user: RouterOutputs["account"]["userWorkspace"]["user"];
}) => {
  const userEmail = user.email ?? "";
  const userImage = user.user_metadata.image ?? "";
  const userName = user.user_metadata.name ?? userEmail ?? "No name";

  const signOut = async () => {
    "use server";
    await api.auth.signOut();
    return redirect("/");
  };

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
        {dashboardPageLinks.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <link.Icon width={16} height={16} />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
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
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {accountPageLinks.map((link) => (
              <DropdownMenuItem key={link.id} asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
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
