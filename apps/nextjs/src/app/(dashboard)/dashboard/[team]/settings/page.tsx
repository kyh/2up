import { redirect } from "next/navigation";

import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TeamDeleteForm } from "./_components/team-delete-form";
import { TeamProfileForm } from "./_components/team-profile-form";

type PageProps = {
  params: Promise<{
    team: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;
  const { account, user } = await api.account.teamWorkspace({
    slug: params.team,
  });

  if (!account) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>{account.name} Settings</PageHeader>
      <section className="divide-y divide-border">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Team Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Update your team's information
            </p>
          </div>
          <div className="md:col-span-2">
            <TeamProfileForm account={account} />
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Danger Zone
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This section contains actions that are irreversible
            </p>
          </div>
          <div className="md:col-span-2">
            <TeamDeleteForm user={user} account={account} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
