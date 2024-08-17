import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { Logo } from "@init/ui/logo";
import { cn, getInitials } from "@init/ui/utils";
import { CheckCircleIcon, LogOutIcon, UserIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/server";
import { CreateTeamAccountMenuItem } from "./create-team-account-form";
import { NavLink } from "./nav";

type PageLink = {
  id: string;
  href: string;
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  exact?: boolean;
};

export const Sidebar = ({
  email,
  account,
  accounts,
  homeLink,
  pageLinks,
  currentAccountSlug,
}: {
  email: RouterOutputs["account"]["userWorkspace"]["user"]["email"];
  account: RouterOutputs["account"]["userWorkspace"]["account"];
  accounts: RouterOutputs["account"]["userWorkspace"]["accounts"];
  homeLink: string;
  pageLinks: PageLink[];
  currentAccountSlug?: string;
}) => {
  const signOut = async () => {
    "use server";
    await api.auth.signOut();
    return redirect("/");
  };

  return (
    <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
      <div className="flex flex-col">
        <div className="flex justify-center pb-2">
          <NavLink href={homeLink}>
            <Logo className="size-10 rounded-lg bg-muted text-primary" />
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
              <link.Icon className="size-4" />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="mt-auto">
          <Avatar className="size-9">
            <AvatarImage
              src={account.pictureUrl ?? ""}
              alt={account.name ?? ""}
            />
            <AvatarFallback>{getInitials(account.name ?? "")}</AvatarFallback>
          </Avatar>
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
              <p className="text-sm font-medium leading-none">{account.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch Teams</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="inline-flex w-full items-center font-normal"
                  >
                    <UserIcon className="size-4" />
                    <span className="ml-2">Personal</span>
                    <CheckCircleIcon
                      className={cn(
                        "ml-auto size-4",
                        !currentAccountSlug ? "opacity-100" : "opacity-0",
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
                      <Avatar className="size-4">
                        <AvatarFallback className="group-hover:bg-background">
                          {account.name ? getInitials(account.name) : ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2">{account.name}</span>
                      <CheckCircleIcon
                        className={cn(
                          "ml-auto size-4",
                          currentAccountSlug === account.slug
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </Link>
                  </DropdownMenuItem>
                ))}
                <CreateTeamAccountMenuItem className="flex w-full gap-2" />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem asChild>
              <button className="flex w-full gap-2">
                <LogOutIcon className="size-4" />
                Log out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
