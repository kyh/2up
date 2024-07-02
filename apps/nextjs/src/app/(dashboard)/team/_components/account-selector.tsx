"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@init/ui/button";

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/react";

type UserWorkspace = RouterOutputs["account"]["userWorkspace"];

export function AccountSelector({
  userWorkspacePromise,
}: {
  userWorkspacePromise: Promise<UserWorkspace>;
}) {
  const initialData = use(userWorkspacePromise);
  const {
    data: { accounts },
  } = api.account.userWorkspace.useQuery(undefined, {
    initialData,
  });

  return (
    <div className="flex w-fit flex-col space-y-2 md:col-span-2">
      {accounts.map((account) => (
        <Button asChild key={account.slug} variant={"outline"}>
          <Link href={`/team/${account.slug}`}>{account.name}</Link>
        </Button>
      ))}
    </div>
  );
}
