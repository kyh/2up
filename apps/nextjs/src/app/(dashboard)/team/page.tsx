import { api } from "@/trpc/server";
import { AccountSelector } from "./_components/account-selector";
import { CreateTeamAccountDialog } from "./_components/create-team-account-dialog";

const Page = async () => {
  await api.account.userWorkspace.prefetch();

  return (
    <main className="flex flex-1 flex-col px-5">
      <section className="divide-y divide-border">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Teams
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Here you can manage your teams
            </p>
          </div>
          <AccountSelector />
        </div>
      </section>
      <section className="divide-y divide-border">
        <CreateTeamAccountDialog />
      </section>
    </main>
  );
};

export default Page;
