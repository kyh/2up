import { redirect } from "next/navigation";

import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const { team } = await api.team.getTeam({
    slug: params.teamSlug,
  });

  if (!team) {
    return redirect("/dashboard/account");
  }

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Billing</PageHeader>
      <section className="divide-y divide-border">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Your Plan
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage your subscription and billing details.
            </p>
          </div>
          <div className="md:col-span-2"></div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Order History
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Download invoices and view your order history.
            </p>
          </div>
          <div className="space-y-3 md:col-span-2"></div>
        </div>
      </section>
    </main>
  );
};

export default Page;
