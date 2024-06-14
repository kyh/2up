import { If } from "@init/ui/if";

import { AccountInvitationsTable } from "./_components/invitations/account-invitations-table";
import { AccountMembersTable } from "./_components/members/account-members-table";
import { InviteMembersDialogContainer } from "./_components/members/invite-members-dialog-container";
import { loadTeamPagePageData } from "./_lib/team-page-loader";

async function Page() {
  const { account, user, members, invitations } = await loadTeamPagePageData();

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
              userRoleHierarchy={currentUserRoleHierarchy}
              currentUserId={user.id}
              currentAccountId={account.id}
              members={members}
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
              permissions={{
                canUpdateInvitation: canManageRoles,
                canRemoveInvitation: canManageRoles,
                currentUserRoleHierarchy,
              }}
              invitations={invitations}
            />
          </div>
        </div>
      </If>
    </section>
  );
}

export default Page;
