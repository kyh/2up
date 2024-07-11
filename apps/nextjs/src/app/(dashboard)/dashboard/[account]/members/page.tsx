import { If } from "@init/ui/if";

import { api } from "@/trpc/server";
import { AccountInvitationsTable } from "./_components/invitations/account-invitations-table";
import { AccountMembersTable } from "./_components/members/account-members-table";
import { InviteMembersDialogContainer } from "./_components/members/invite-members-dialog-container";
import { loadTeamPagePageData } from "./_lib/team-page-loader";

interface Params {
  account: string;
}

const Page = async ({ params }: { params: Params }) => {
  const { account, user } = await loadTeamPagePageData(params.account);

  const membersPromise = api.team.members({ slug: params.account });
  const invitationsPromise = api.team.invitations({ slug: params.account });

  const canManageRoles = account.permissions.includes("roles.manage");
  const canManageInvitations = account.permissions.includes("invites.manage");

  const isPrimaryOwner = account.primary_owner_user_id === user.id;
  const currentUserRoleHierarchy = account.role_hierarchy_level;

  return (
    <section className="divide-y divide-border">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
        <div>
          <h2 className="text-base font-light leading-7 text-primary">
            Members
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Here you can manage the members of your team.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="space-y-4">
            <InviteMembersDialogContainer
              userRoleHierarchy={currentUserRoleHierarchy}
              accountSlug={account.slug}
            />
            <AccountMembersTable
              slug={account.slug}
              userRoleHierarchy={currentUserRoleHierarchy}
              currentUserId={user.id}
              currentAccountId={account.id}
              membersPromise={membersPromise}
              isPrimaryOwner={isPrimaryOwner}
              canManageRoles={canManageRoles}
            />
          </div>
        </div>
      </div>
      <If condition={canManageInvitations}>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Pending Invites
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Here you can manage the pending invitations to your team.
            </p>
          </div>
          <div className="md:col-span-2">
            <AccountInvitationsTable
              slug={params.slug}
              permissions={{
                canUpdateInvitation: canManageRoles,
                canRemoveInvitation: canManageRoles,
                currentUserRoleHierarchy,
              }}
              invitationsPromise={invitationsPromise}
            />
          </div>
        </div>
      </If>
    </section>
  );
};

export default Page;
