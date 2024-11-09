import type { GetTasksInput } from "@init/api/task/task-schema";
import { PageHeader } from "@/components/header";
import { api, HydrateClient } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

type PageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<GetTasksInput>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  void api.team.getTeam.prefetch({
    slug: params.teamSlug,
  });
  void api.task.getTasks.prefetch({
    ...searchParams,
  });

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col px-5">
        <PageHeader>Welcome back</PageHeader>
        <TasksTable teamSlug={params.teamSlug} searchParams={searchParams} />
      </main>
    </HydrateClient>
  );
};

export default Page;
