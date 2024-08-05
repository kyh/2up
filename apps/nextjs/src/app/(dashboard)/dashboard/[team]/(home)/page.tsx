import { redirect } from "next/navigation";

import type { GetTaskListInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";

type Params = {
  team: string;
};

type SearchParams = GetTaskListInput;

const Page = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { account } = await api.account.teamWorkspace({
    slug: params.team,
  });

  if (!account) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch>Welcome back {account.name}</PageHeader>
    </main>
  );
};

export default Page;
