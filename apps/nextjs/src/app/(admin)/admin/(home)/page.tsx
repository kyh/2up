import {
  AccountsCard,
  PayingCustomersCard,
  TeamAccountsCard,
  TrialsCard,
} from "@/app/(admin)/_components/admin-cards";
import { PageHeader } from "@/components/header";
import { api, HydrateClient } from "@/trpc/server";

const Page = () => {
  void api.admin.getDashboardData.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col px-5">
        <PageHeader>Admin</PageHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AccountsCard />
          <TeamAccountsCard />
          <PayingCustomersCard />
          <TrialsCard />
        </div>
      </main>
    </HydrateClient>
  );
};

export default Page;
