import { redirect } from "next/navigation";

import type { GetTaskListInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

type SearchParams = GetTaskListInput;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { workspace } = await api.account.userWorkspace();

  // This should never happen
  if (!workspace.id) {
    redirect("/");
  }

  await api.task.getTaskList.prefetch({
    ...searchParams,
    accountId: workspace.id,
  });

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Welcome back</PageHeader>
      <TasksTable accountId={workspace.id} searchParams={searchParams} />
    </main>
  );
};

export default Page;
