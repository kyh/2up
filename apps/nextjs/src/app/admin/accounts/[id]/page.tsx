import { api } from "@/trpc/server";
import { AdminAccountPage } from "../_components/admin-account-page";
import { AdminGuard } from "../../_components/admin-guard";

interface Params {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({ params }: Params) => {
  const account = await api.admin.getAccount({ accountId: params.id });

  return {
    title: `Admin | ${account.name}`,
  };
};

async function AccountPage({ params }: Params) {
  const account = await api.admin.getAccount({ accountId: params.id });

  return (
    <main className="flex flex-1 flex-col px-5">
      <AdminAccountPage account={account} />
    </main>
  );
}

export default AdminGuard(AccountPage);
