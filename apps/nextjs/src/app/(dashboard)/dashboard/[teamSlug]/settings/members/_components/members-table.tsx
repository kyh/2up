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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@init/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { TeamMemberRole } from "@init/api/team/team-schema";
import type { UserMetadata } from "@init/api/user/user-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";

type MembersTableProps = {
  teamId: string;
};

export const MembersTable = ({ teamId }: MembersTableProps) => {
  const [{ user }] = api.auth.workspace.useSuspenseQuery();
  const [{ team }] = api.team.getTeam.useSuspenseQuery({
    id: teamId,
  });

  const userId = user?.id;
  const members = team?.teamMembers ?? [];
  const userRole = members.find((member) => member.userId === userId)
    ?.role as TeamMemberRole;

  const columns = useMemo(() => {
    if (!userId) return [];
    return getColumns({ userId, userRole, teamId });
  }, [userId, userRole, teamId]);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-row-id={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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

  const onChangeRole = (newRole: TeamMemberRole) => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!isMemberSelf && ( // Can't change own role
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
          )}
          {isSelfOwner &&
            !isMemberOwner && ( // Only owners can transfer ownership
              <DropdownMenuItem onSelect={onTransferOwnership}>
                Transfer Ownership
              </DropdownMenuItem>
            )}
          {!isMemberOwner && ( // Cannot remove owner
            <DropdownMenuItem onSelect={onRemoveFromTeam}>
              Remove from Team
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
