"use client";

import Link from "next/link";
import { Button } from "@init/ui/button";

import { CreateTeamAccountDialog } from "@/components/accounts/create-team-account-dialog";
import { api } from "@/trpc/react";

export const AccountSelector = () => {
  const [data] = api.account.userWorkspace.useSuspenseQuery();

  return (
    <div className="flex w-fit flex-col space-y-2 md:col-span-2">
      {data.accounts.map((account) => (
        <Button asChild key={account.slug} variant="outline">
          <Link href={`/team/${account.slug}`}>{account.name}</Link>
        </Button>
      ))}
      <CreateTeamAccountDialog>
        <Button>Create a Team</Button>
      </CreateTeamAccountDialog>
    </div>
  );
};
