"use client";

import { useMemo } from "react";
import { teamMemberRoles } from "@init/api/team/team-schema";
import { alertDialog } from "@init/ui/alert-dialog";
import { ProfileAvatar } from "@init/ui/avatar";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { AutoTable } from "@init/ui/table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { TeamMemberRole } from "@init/api/team/team-schema";
import type { UserMetadata } from "@init/api/user/user-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";

type MembersTableProps = {
  teamSlug: string;
};

export const MembersTable = ({ teamSlug }: MembersTableProps) => {
  const [{ team }] = api.team.getTeam.useSuspenseQuery({ slug: teamSlug });
  const [{ user }] = api.auth.workspace.useSuspenseQuery();

  const userId = user?.id;
  const members = team?.teamMembers ?? [];
  const userRole = members.find((member) => member.userId === userId)
    ?.role as TeamMemberRole;

  const columns = useMemo(() => {
    if (!userId || !team) return [];
    return getColumns({ userId, userRole, teamId: team.id });
  }, [userId, userRole, team]);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <AutoTable table={table} />
    </div>
  );
};

type TeamMember = NonNullable<
  RouterOutputs["team"]["getTeamMember"]["teamMember"]
>;

type getColumnsParams = {
  userId: string;
  userRole: TeamMemberRole;
  teamId: string;
};
export const getColumns = ({
  userId,
  userRole,
  teamId,
}: getColumnsParams): ColumnDef<TeamMember>[] => [
  {
    header: "Name",
    cell: ({ row }) => {
      const member = row.original;
      const userMetadata = member.user.rawUserMetaData as UserMetadata;
      const displayName = getDisplayName(member);
      const isSelf = member.userId === userId;

      return (
        <span className="flex items-center gap-4 text-left">
          <ProfileAvatar
            displayName={displayName}
            avatarUrl={userMetadata.avatarUrl}
          />
          <span>{displayName}</span>
          {isSelf && <Badge variant="outline">You</Badge>}
        </span>
      );
    },
  },
  {
    header: "Email",
    cell: ({ row }) => row.original.user.email ?? "-",
  },
  {
    header: "Role",
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.role}</Badge>
    ),
  },
  {
    header: "Joined at",
    cell: ({ row }) => new Date(row.original.joinedAt).toLocaleDateString(),
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <ActionsDropdown
        member={row.original}
        userId={userId}
        userRole={userRole}
        teamId={teamId}
      />
    ),
  },
];

const ActionsDropdown = ({
  member,
  userId,
  userRole,
  teamId,
}: {
  member: TeamMember;
  userId: string;
  userRole: TeamMemberRole;
  teamId: string;
}) => {
  const isSelfOwner = userRole === "owner";
  const isMemberSelf = member.userId === userId;
  const isMemberOwner = member.role === "owner";

  const onChangeRole = (newRole: string) => {
    const displayName = getDisplayName(member);
    alertDialog.open(`Change ${displayName}'s role?`, {
      description: `You are about to change ${displayName}'s role to ${newRole}. This may affect their permissions.`,
      action: {
        label: "Change",
        onClick: () => {
          // updateMemberRole.mutate({
          //   teamId: teamId,
          //   userId: member.userId,
          //   role: newRole,
          // });
        },
      },
    });
  };

  const onTransferOwnership = () => {
    const displayName = getDisplayName(member);
    alertDialog.open(`Transfer ownership to ${displayName}?`, {
      description: `You are about to transfer ownership to ${displayName}. You will lose your ownership permissions.`,
      action: {
        label: "Transfer",
        onClick: () => {
          // transferOwnership.mutate({ accountId: teamId, userId: member.userId });
        },
      },
    });
  };

  const onRemoveFromTeam = () => {
    const displayName = getDisplayName(member);
    alertDialog.open(`Remove ${displayName} from the team?`, {
      description: `You are about to remove ${displayName} from the team. They will lose access to this workspace.`,
      action: {
        label: "Remove",
        onClick: () => {
          // removeMember.mutate({ accountId: teamId, userId: member.userId });
        },
      },
    });
  };

  // Members have no permissions to do any actions
  if (userRole === "member") {
    return null;
  }

  const actions = [
    !isMemberSelf && ( // Can't change own role
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={member.role}
            onValueChange={onChangeRole}
          >
            {teamMemberRoles.map((role) => (
              <DropdownMenuRadioItem
                key={role}
                value={role}
                className="capitalize"
              >
                {role}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    ),
    isSelfOwner &&
      !isMemberOwner && ( // Only owners can transfer ownership
        <DropdownMenuItem onSelect={onTransferOwnership}>
          Transfer Ownership
        </DropdownMenuItem>
      ),
    !isMemberOwner && ( // Cannot remove owner
      <DropdownMenuItem onSelect={onRemoveFromTeam}>
        Remove from Team
      </DropdownMenuItem>
    ),
  ].filter((action) => !!action);

  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action) => (
          <>{action}</>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getDisplayName = (member: TeamMember) => {
  const userMetadata = member.user.rawUserMetaData as UserMetadata;
  return (
    userMetadata.displayName ??
    member.user.email?.split("@")[0] ??
    member.userId
  );
};
