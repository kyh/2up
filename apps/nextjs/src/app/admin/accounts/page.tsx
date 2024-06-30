import type { GetAccountsInput } from "@init/api/admin/admin-schema";
import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { AdminGuard } from "../_components/admin-guard";
import { AdminAccountsTable } from "./_components/admin-accounts-table";

type SearchParams = {} & GetAccountsInput;

export const metadata = {
  title: `Accounts`,
};

const AccountsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  const accountsPromise = api.admin.getAccounts(searchParams);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Accounts</PageHeader>

      <AdminAccountsTable
        searchParams={searchParams}
        accountsPromise={accountsPromise}
      />
    </main>
  );
};

export default AdminGuard(AccountsPage);
