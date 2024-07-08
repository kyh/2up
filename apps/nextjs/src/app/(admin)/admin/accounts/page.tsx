import type { GetAccountsInput } from "@init/api/admin/admin-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { AdminAccountsTable } from "./admin-accounts-table";

type SearchParams = {} & GetAccountsInput;

export const metadata = {
  title: `Accounts`,
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  await api.admin.getAccounts.prefetch(searchParams);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Accounts</PageHeader>
      <AdminAccountsTable searchParams={searchParams} />
    </main>
  );
};

export default Page;
