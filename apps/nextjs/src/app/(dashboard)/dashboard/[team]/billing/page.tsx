import { redirect } from "next/navigation";

import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";

type Params = {
  team: string;
};

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const { account } = await api.account.teamWorkspace({
    slug: params.team,
  });

  if (!account) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Billing</PageHeader>
    </main>
  );
};

export default Page;
