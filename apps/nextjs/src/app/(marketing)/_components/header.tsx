"use client";

import Link from "next/link";
import { buttonVariants } from "@init/ui/button";
import { cn } from "@init/ui/utils";

import { api } from "@/trpc/react";

export const Header = () => {
  const [{ user }] = api.auth.me.useSuspenseQuery();
  const [teams] = api.team.getMyTeams.useSuspenseQuery();
  const defaultTeamId =
    (user?.user_metadata.defaultTeam as string | undefined) ?? teams[0]?.id;

  return (
    <div className="mx-auto w-full justify-center">
      <div className="border-t-none mx-auto flex w-full max-w-7xl items-center justify-between border border-border px-8 py-4 md:p-8">
        <div className="flex items-center justify-between text-secondary-foreground">
          <Link className="font-display inline-flex items-center" href="/">
            Init.
          </Link>
        </div>
        <nav className="ml-auto flex items-center text-sm">
          <Link
            className="px-4 py-2 text-muted-foreground transition hover:text-secondary-foreground"
            href="/docs"
          >
            Documentation
          </Link>
          <Link
            className="px-4 py-2 text-muted-foreground transition hover:text-secondary-foreground"
            href="https://github.com/kyh/init"
            target="_blank"
          >
            Github
          </Link>
          {user ? (
            <Link
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                }),
                "ml-4 rounded-full px-5",
              )}
              href={`/dashboard/${defaultTeamId}`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                }),
                "ml-4 rounded-full px-5",
              )}
              href="/auth/sign-in"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
