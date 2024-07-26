import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import React from "react";
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
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { Logo } from "@init/ui/logo";
import { cn, getInitials } from "@init/ui/utils";
import { CheckCircleIcon, LogOutIcon, PlusIcon, UserIcon } from "lucide-react";

import { NavLink } from "@/components/nav";
import { api } from "@/trpc/server";
import { CreateTeamAccountDialog } from "./accounts/create-team-account-dialog";

const PERSONAL_ACCOUNT_SLUG = "personal";

export const Sidebar = async ({
  slug = PERSONAL_ACCOUNT_SLUG,
  pageLinks,
}: {
  accountId?: string;
  slug?: string;
  pageLinks: readonly {
    readonly id: string;
    readonly href: string;
    readonly label: string;
    readonly Icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    readonly exact?: boolean;
  }[];
}) => {
  const { user, accounts } = await api.account.userWorkspace();

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
        <div className="flex justify-center pb-2">
          <NavLink href="/dashboard">
            <Logo
              width={40}
              height={40}
              className="rounded-lg bg-muted text-primary"
            />
            <span className="sr-only">Init</span>
          </NavLink>
        </div>
        {pageLinks.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            exact={link.exact}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <link.Icon width={16} height={16} />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        {/* <NotificationsPopover accountIds={accountIds} realtime={true} /> */}
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
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Your Accounts</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center font-normal"
              >
                <UserIcon className="h-4 w-4" />
                <span className="ml-2">Personal Account</span>
                <CheckCircleIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    slug === PERSONAL_ACCOUNT_SLUG
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </Link>
            </DropdownMenuItem>
            {accounts.map((account) => (
              <DropdownMenuItem key={account.id} asChild>
                <Link
                  href={`/dashboard/${account.slug}`}
                  className="inline-flex w-full items-center font-normal"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="group-hover:bg-background">
                      {account.name ? account.name[0] : ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{account.name}</span>
                  <CheckCircleIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      slug === account.slug ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              </DropdownMenuItem>
            ))}
            <CreateTeamAccountDialog>
              <DropdownMenuItem asChild>
                <button className="flex w-full gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Create a Team
                </button>
              </DropdownMenuItem>
            </CreateTeamAccountDialog>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem className="w-full" asChild>
              <button className="flex w-full gap-2">
                <LogOutIcon className="h-4 w-4" />
                Log out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
