"use client";

import Link from "next/link";
import { buttonVariants } from "@init/ui/button";
import { cn } from "@init/ui/utils";

import { api } from "@/trpc/react";

export const Header = () => {
  const { data, isLoading } = api.auth.workspace.useQuery();

  const user = data?.user;
  const metaData = data?.userMetadata;

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
          {isLoading ? (
            <span
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "ml-4 w-24 animate-pulse rounded-full px-5",
              )}
            />
          ) : user ? (
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "ml-4 w-24 rounded-full px-5",
              )}
              href={`/dashboard/${metaData?.defaultTeamSlug}`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "ml-4 w-24 rounded-full px-5",
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
