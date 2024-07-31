"use client";

import { useState } from "react";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { If } from "@init/ui/if";
import { ProfileAvatar } from "@init/ui/profile-avatar";
import { MoreHorizontalIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { ColumnDef } from "@tanstack/react-table";
import { RoleBadge } from "../../../../[account]/members/_components/role-badge";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { TransferOwnershipDialog } from "./transfer-ownership-dialog";
import { UpdateMemberRoleDialog } from "./update-member-role-dialog";

type Members = RouterOutputs["account"]["members"];

type Permissions = {
  canUpdateRole: (roleHierarchy: number) => boolean;
  canRemoveFromAccount: (roleHierarchy: number) => boolean;
  canTransferOwnership: boolean;
};

export const getColumns = (
  permissions: Permissions,
  params: {
    currentUserId: string;
    currentAccountId: string;
    currentRoleHierarchy: number;
  },
): ColumnDef<Members[0]>[] => [
  {
    header: "Name",
    cell: ({ row }) => {
      const member = row.original;
      const displayName = member.name ?? member.email.split("@")[0];
      const isSelf = member.userId === params.currentUserId;

      return (
        <span className="flex items-center space-x-4 text-left">
          <span>
            <ProfileAvatar
              displayName={displayName}
              pictureUrl={member.pictureUrl}
            />
          </span>

          <span>{displayName}</span>

          <If condition={isSelf}>
            <Badge variant="outline">You</Badge>
          </If>
        </span>
      );
    },
  },
  {
    header: "Email",
    cell: ({ row }) => {
      return row.original.email ?? "-";
    },
  },
  {
    header: "Role",
    cell: ({ row }) => {
      const { role, primaryOwnerUserId, userId } = row.original;
      const isPrimaryOwner = primaryOwnerUserId === userId;

      return (
        <span className="flex items-center space-x-1">
          <RoleBadge role={role} />

          <If condition={isPrimaryOwner}>
            <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-xs font-medium dark:text-black">
              Primary Owner
            </span>
          </If>
        </span>
      );
    },
  },
  {
    header: "Joined at",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <ActionsDropdown
        permissions={permissions}
        member={row.original}
        currentUserId={params.currentUserId}
        currentTeamAccountId={params.currentAccountId}
        currentRoleHierarchy={params.currentRoleHierarchy}
      />
    ),
  },
];

const ActionsDropdown = ({
  permissions,
  member,
  currentUserId,
  currentTeamAccountId,
  currentRoleHierarchy,
}: {
  permissions: Permissions;
  member: Members[0];
  currentUserId: string;
  currentTeamAccountId: string;
  currentRoleHierarchy: number;
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const isCurrentUser = member.userId === currentUserId;
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
            <DropdownMenuItem onClick={() => setIsUpdatingRole(true)}>
              Update Role
            </DropdownMenuItem>
          </If>

          <If condition={permissions.canTransferOwnership}>
            <DropdownMenuItem onClick={() => setIsTransferring(true)}>
              Transfer Ownership
            </DropdownMenuItem>
          </If>

          <If condition={canRemoveFromAccount}>
            <DropdownMenuItem onClick={() => setIsRemoving(true)}>
              Remove from Account
            </DropdownMenuItem>
          </If>
        </DropdownMenuContent>
      </DropdownMenu>

      <If condition={isRemoving}>
        <RemoveMemberDialog
          isOpen
          setIsOpen={setIsRemoving}
          teamAccountId={currentTeamAccountId}
          userId={member.userId}
        />
      </If>

      <If condition={isUpdatingRole}>
        <UpdateMemberRoleDialog
          isOpen
          setIsOpen={setIsUpdatingRole}
          userId={member.userId}
          userRole={member.role}
          teamAccountId={currentTeamAccountId}
          userRoleHierarchy={currentRoleHierarchy}
        />
      </If>

      <If condition={isTransferring}>
        <TransferOwnershipDialog
          isOpen
          setIsOpen={setIsTransferring}
          targetDisplayName={member.name ?? member.email}
          accountId={member.accountId}
          userId={member.userId}
        />
      </If>
    </>
  );
};
