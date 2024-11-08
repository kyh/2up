"use client";

import { useMemo } from "react";
import { teamMemberRoles } from "@init/api/team/team-schema";
import { alertDialog } from "@init/ui/alert-dialog";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";

type InvitationsTableProps = {
  team: RouterOutputs["team"]["getTeam"]["team"];
};

export const InvitationsTable = ({ team }: InvitationsTableProps) => {
  const [{ user }] = api.auth.workspace.useSuspenseQuery();

  const userId = user?.id;
  const invitations = team?.invitations ?? [];
  const members = team?.teamMembers ?? [];
  const userRole = members.find((member) => member.userId === userId)
    ?.role as TeamMemberRole;

  const columns = useMemo(() => {
    if (!userId || !team) return [];
    return getColumns({ userId, userRole, teamId: team.id });
  }, [userId, userRole, team]);

  const table = useReactTable({
    data: invitations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <AutoTable table={table} />
    </div>
  );
};

type Invitation = NonNullable<
  RouterOutputs["team"]["getTeamInvitation"]["invitation"]
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
}: getColumnsParams): ColumnDef<Invitation>[] => [
  {
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    header: "Role",
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.role}</Badge>
    ),
  },
  {
    header: "Invited at",
    cell: ({ row }) => {
      return new Date(row.original.invitedAt).toLocaleDateString();
    },
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <ActionsDropdown
        invitation={row.original}
        userId={userId}
        userRole={userRole}
        teamId={teamId}
      />
    ),
  },
];

const ActionsDropdown = ({
  invitation,
  userId,
  userRole,
  teamId,
}: {
  invitation: Invitation;
  userId: string;
  userRole: TeamMemberRole;
  teamId: string;
}) => {
  const onChangeRole = (newRole: TeamMemberRole) => {
    alertDialog.open(`Change ${invitation.email}'s role?`, {
      description: `You are about to change ${invitation.email}'s role to ${newRole}. This may affect their permissions.`,
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

  const onRemoveInvitation = () => {
    alertDialog.open(`Remove ${invitation.email}'s invite?`, {
      description: `You are about to remove ${invitation.email}'s invite. This will revoke their access to the team.`,
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {teamMemberRoles.map((role) => (
              <DropdownMenuItem onSelect={() => onChangeRole(role)}>
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onSelect={onRemoveInvitation}>
          Remove Invitation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
