import type { RetrieveInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

type SearchParams = {} & RetrieveInput;

const TasksPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  await api.task.retrieve.prefetch(searchParams);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch>Welcome back</PageHeader>
      <TasksTable searchParams={searchParams} />
    </main>
  );
};

export default TasksPage;
