import { redirect } from "next/navigation";

import type { RetrieveInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

type Params = {
  account: string;
};

type SearchParams = RetrieveInput;

const TasksPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { account } = await api.account.teamWorkspace({
    slug: params.account,
  });

  if (!account) {
    redirect("/dashboard");
  }

  await api.task.retrieve.prefetch({ ...searchParams, accountId: account.id });

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch>Welcome back</PageHeader>
      <TasksTable accountId={account.id} searchParams={searchParams} />
    </main>
  );
};

export default TasksPage;
