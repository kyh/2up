"use client";

import { useMemo, useState } from "react";
import { ProfileAvatar } from "@init/ui/avatar";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { If } from "@init/ui/if";
import { Input } from "@init/ui/input";
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
import type { UserMetadata } from "@init/api/user/user-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { TransferOwnershipDialog } from "./transfer-ownership-dialog";
import { UpdateMemberRoleDialog } from "./update-member-role-dialog";

type MembersTableProps = {
  teamId: string;
};

export const MembersTable = ({ teamId }: MembersTableProps) => {
  const [search, setSearch] = useState("");
  const [{ user }] = api.auth.workspace.useSuspenseQuery();
  const [{ team }] = api.team.getTeam.useSuspenseQuery({
    id: teamId,
  });

  const userId = user?.id;
  const members = team?.teamMembers ?? [];

  const columns = useMemo(() => {
    if (!userId) return [];
    return getColumns({ userId, teamId });
  }, [userId, teamId]);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={search}
        onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        placeholder="Search members"
      />
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

type TeamMember = NonNullable<
  RouterOutputs["team"]["getTeamMember"]["teamMember"]
>;

type getColumnsParams = {
  userId: string;
  teamId: string;
};
export const getColumns = ({
  userId,
  teamId,
}: getColumnsParams): ColumnDef<TeamMember>[] => [
  {
    header: "Name",
    cell: ({ row }) => {
      const member = row.original;
      const userMetadata = member.user.rawUserMetaData as UserMetadata;
      const displayName =
        userMetadata.displayName ??
        member.user.email?.split("@")[0] ??
        member.userId;
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
    cell: ({ row }) => <Badge>{row.original.role}</Badge>,
  },
  {
    header: "Joined at",
    cell: ({ row }) => new Date(row.original.joinedAt).toLocaleDateString(),
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <ActionsDropdown member={row.original} userId={userId} teamId={teamId} />
    ),
  },
];

const ActionsDropdown = ({
  member,
  userId,
  teamId,
}: {
  member: TeamMember;
  userId: string;
  teamId: string;
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const isCurrentUser = member.userId === userId;
  const isPrimaryOwner = member.primaryOwnerUserId === member.userId;

  if (isCurrentUser || isPrimaryOwner) {
    return null;
  }

  const memberRoleHierarchy = member.roleHierarchyLevel;
  const canUpdateRole = permissions.canUpdateRole(memberRoleHierarchy);

  const canRemoveFromAccount =
    permissions.canRemoveFromAccount(memberRoleHierarchy);

  // if has no permission to update role, transfer ownership or remove from account
  // do not render the dropdown menu
  if (
    !canUpdateRole &&
    !permissions.canTransferOwnership &&
    !canRemoveFromAccount
  ) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <If condition={canUpdateRole}>
            <DropdownMenuItem onSelect={() => setIsUpdatingRole(true)}>
              Update Role
            </DropdownMenuItem>
          </If>
          <If condition={permissions.canTransferOwnership}>
            <DropdownMenuItem onSelect={() => setIsTransferring(true)}>
              Transfer Ownership
            </DropdownMenuItem>
          </If>
          <If condition={canRemoveFromAccount}>
            <DropdownMenuItem onSelect={() => setIsRemoving(true)}>
              Remove from Account
            </DropdownMenuItem>
          </If>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveMemberDialog
        open={isRemoving}
        onOpenChange={setIsRemoving}
        teamAccountId={teamId}
        userId={member.userId}
      />
      <UpdateMemberRoleDialog
        open={isUpdatingRole}
        onOpenChange={setIsUpdatingRole}
        userId={member.userId}
        userRole={member.role}
        teamAccountId={teamId}
        userRoleHierarchy={currentRoleHierarchy}
      />
      <TransferOwnershipDialog
        open={isTransferring}
        onOpenChange={setIsTransferring}
        targetDisplayName={member.name ?? member.email}
        accountId={member.accountId}
        userId={member.userId}
      />
    </>
  );
};
