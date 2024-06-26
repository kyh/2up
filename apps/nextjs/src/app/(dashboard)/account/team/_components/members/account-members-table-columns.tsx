"use client";

import { useState } from "react";
import { RouterOutputs } from "@init/api";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { RoleBadge } from "../role-badge";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { TransferOwnershipDialog } from "./transfer-ownership-dialog";
import { UpdateMemberRoleDialog } from "./update-member-role-dialog";

type Members = RouterOutputs["team"]["members"];

interface Permissions {
  canUpdateRole: (roleHierarchy: number) => boolean;
  canRemoveFromAccount: (roleHierarchy: number) => boolean;
  canTransferOwnership: boolean;
}

export function getColumns(
  permissions: Permissions,
  params: {
    currentUserId: string;
    currentAccountId: string;
    currentRoleHierarchy: number;
  },
): ColumnDef<Members[0]>[] {
  return [
    {
      header: "Name",
      cell: ({ row }) => {
        const member = row.original;
        const displayName = member.name ?? member.email.split("@")[0];
        const isSelf = member.user_id === params.currentUserId;

        return (
          <span className={"flex items-center space-x-4 text-left"}>
            <span>
              <ProfileAvatar
                displayName={displayName}
                pictureUrl={member.picture_url}
              />
            </span>

            <span>{displayName}</span>

            <If condition={isSelf}>
              <Badge variant={"outline"}>You</Badge>
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
        const { role, primary_owner_user_id, user_id } = row.original;
        const isPrimaryOwner = primary_owner_user_id === user_id;

        return (
          <span className={"flex items-center space-x-1"}>
            <RoleBadge role={role} />

            <If condition={isPrimaryOwner}>
              <span
                className={
                  "rounded-md bg-yellow-400 px-2.5 py-1 text-xs font-medium dark:text-black"
                }
              >
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
        return new Date(row.original.created_at).toLocaleDateString();
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
}

function ActionsDropdown({
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
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const isCurrentUser = member.user_id === currentUserId;
  const isPrimaryOwner = member.primary_owner_user_id === member.user_id;

  if (isCurrentUser || isPrimaryOwner) {
    return null;
  }

  const memberRoleHierarchy = member.role_hierarchy_level;
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
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
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
          userId={member.user_id}
        />
      </If>

      <If condition={isUpdatingRole}>
        <UpdateMemberRoleDialog
          isOpen
          setIsOpen={setIsUpdatingRole}
          userId={member.user_id}
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
          accountId={member.account_id}
          userId={member.user_id}
        />
      </If>
    </>
  );
}
