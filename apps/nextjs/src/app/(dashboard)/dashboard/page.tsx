import { RetrieveInput } from "@init/api/task/task-schema";

import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

interface SearchParams extends RetrieveInput {}

function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const tasksPromise = api.task.retrieve(searchParams);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch>Welcome back</PageHeader>
      <TasksTable tasksPromise={tasksPromise} searchParams={searchParams} />
    </main>
  );
}

export default TasksPage;
