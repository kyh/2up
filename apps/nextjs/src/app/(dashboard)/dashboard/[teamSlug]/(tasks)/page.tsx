import type { GetTasksInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api, HydrateClient } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

type PageProps = {
  searchParams: Promise<GetTasksInput>;
};

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  void api.task.getTasks.prefetch({
    ...searchParams,
  });

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col px-5">
        <PageHeader>Welcome back</PageHeader>
        <TasksTable searchParams={searchParams} />
      </main>
    </HydrateClient>
  );
};

export default Page;
