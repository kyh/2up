import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TasksTable } from "./_components/tasks-table";

interface Params {
  searchParams: {
    page: string;
    per_page: string;
    sort: string;
  };
}

const Page = async ({ searchParams }: Params) => {
  const page = parseInt(searchParams.page ?? 1);
  const perPage = parseInt(searchParams.per_page ?? 10);

  const { data, count } = await api.task.retrieve({
    page,
    perPage,
    sort: searchParams.sort,
  });

  const pageCount = Math.ceil((count ?? 0) / perPage);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch>Welcome back</PageHeader>
      <TasksTable data={data} pageCount={pageCount} />
    </main>
  );
};

export default Page;
