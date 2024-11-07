import { redirect } from "next/navigation";

import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
// import { InvitationsTable } from "./_components/invitations-table";
import { InviteMembersDialog } from "./_components/invite-members-form";

// import { MembersTable } from "./_components/members-table";

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
      <PageHeader>Team Members</PageHeader>
      <section className="divide-y divide-border">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Members
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage the members of your team.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-4">
              <InviteMembersDialog teamId={team.id} />
              {/* <MembersTable teamId={team.id} /> */}
            </div>
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Pending Invites
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage the pending invitations to your team.
            </p>
          </div>
          <div className="md:col-span-2">
            {/* <InvitationsTable
              slug={account.slug}
              permissions={{
                canUpdateInvitation: canManageRoles,
                canRemoveInvitation: canManageRoles,
                currentUserRoleHierarchy,
              }}
            /> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
