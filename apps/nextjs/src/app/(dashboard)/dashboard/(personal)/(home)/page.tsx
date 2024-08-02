import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";

const Page = async () => {
  await api.account.userWorkspace.prefetch();

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Home</PageHeader>
    </main>
  );
};

export default Page;
