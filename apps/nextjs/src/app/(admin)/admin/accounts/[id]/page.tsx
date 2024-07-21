import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/server";
import { AdminAccountPage } from "./_components/admin-account-page";

type Account = RouterOutputs["admin"]["getAccount"];

type Params = {
  params: {
    id: string;
  };
};

export const generateMetadata = async ({ params }: Params) => {
  const account = await api.admin.getAccount({ accountId: params.id });

  return {
    title: `Admin | ${account.name}`,
  };
};

const Page = async ({ params }: Params) => {
  const account = await api.admin.getAccount({ accountId: params.id });

  return (
    <main className="flex flex-1 flex-col px-5">
      <AdminAccountPage account={account} />
    </main>
  );
};

export default Page;
