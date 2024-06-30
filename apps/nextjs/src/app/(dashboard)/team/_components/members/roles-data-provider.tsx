"use client";

import { Spinner } from "@init/ui/spinner";

import { api } from "@/trpc/react";

export function RolesDataProvider(props: {
  maxRoleHierarchy: number;
  children: (roles: string[]) => React.ReactNode;
}) {
  const retrieveQuery = api.role.retrieve.useQuery({
    maxRoleHierarchy: props.maxRoleHierarchy,
  });

  if (retrieveQuery.isLoading) {
    return (
      <div className={"flex flex-col items-center justify-center p-4"}>
        <Spinner />
      </div>
    );
  }

  if (retrieveQuery.isError) {
    return null;
  }

  return <>{props.children(retrieveQuery.data ?? [])}</>;
}
