import { redirect } from "next/navigation";

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

  const { team } = await api.team.getTeam({
    slug: params.teamSlug,
  });

  if (!team) {
    redirect("/404");
  }

  const filters = searchParams.filter ?? [];
  const getTasksInput: GetTasksInput = {
    ...searchParams,
    filter: [...filters, { field: "teamId", value: team.id }],
  };
  void api.task.getTasks.prefetch(getTasksInput);

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col px-5">
        <PageHeader>Welcome back</PageHeader>
        <TasksTable teamId={team.id} getTasksInput={getTasksInput} />
      </main>
    </HydrateClient>
  );
};

export default Page;
