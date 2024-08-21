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
import { EllipsisIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { ColumnDef } from "@tanstack/react-table";
import { RoleBadge } from "../role-badge";
import { DeleteInvitationDialog } from "./delete-invitation-dialog";
import { RenewInvitationDialog } from "./renew-invitation-dialog";
import { UpdateInvitationDialog } from "./update-invitation-dialog";

type Invitations = RouterOutputs["account"]["invitations"];

export const getColumns = (permissions: {
  canUpdateInvitation: boolean;
  canRemoveInvitation: boolean;
  currentUserRoleHierarchy: number;
}): ColumnDef<Invitations[0]>[] => [
  {
    header: "Email",
    cell: ({ row }) => {
      const member = row.original;
      const email = member.email;

      return (
        <span className="flex items-center space-x-4 text-left">
          <span>
            <ProfileAvatar text={email} />
          </span>

          <span>{email}</span>
        </span>
      );
    },
  },
  {
    header: "Role",
    cell: ({ row }) => {
      const { role } = row.original;

      return <RoleBadge role={role} />;
    },
  },
  {
    header: "Invited at",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    header: "Expires at",
    cell: ({ row }) => {
      return new Date(row.original.expiresAt).toLocaleDateString();
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const isExpired = getIsInviteExpired(row.original.expiresAt);

      if (isExpired) {
        return <Badge variant="warning">Expired</Badge>;
      }

      return <Badge variant="success">Active</Badge>;
    },
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <ActionsDropdown permissions={permissions} invitation={row.original} />
    ),
  },
];

const ActionsDropdown = ({
  permissions,
  invitation,
}: {
  permissions: {
    canUpdateInvitation: boolean;
    canRemoveInvitation: boolean;
    currentUserRoleHierarchy: number;
  };
  invitation: Invitations[0];
}) => {
  const [isDeletingInvite, setIsDeletingInvite] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isRenewingInvite, setIsRenewingInvite] = useState(false);

  if (!permissions.canUpdateInvitation && !permissions.canRemoveInvitation) {
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
            <EllipsisIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <If condition={permissions.canUpdateInvitation}>
            <DropdownMenuItem onSelect={() => setIsUpdatingRole(true)}>
              Update Invitation
            </DropdownMenuItem>
            <If condition={getIsInviteExpired(invitation.expiresAt)}>
              <DropdownMenuItem onSelect={() => setIsRenewingInvite(true)}>
                Renew Invitation
              </DropdownMenuItem>
            </If>
          </If>
          <If condition={permissions.canRemoveInvitation}>
            <DropdownMenuItem onSelect={() => setIsDeletingInvite(true)}>
              Remove Invitation
            </DropdownMenuItem>
          </If>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteInvitationDialog
        open={isDeletingInvite}
        onOpenChange={setIsDeletingInvite}
        invitationId={invitation.id}
      />
      <UpdateInvitationDialog
        open={isUpdatingRole}
        onOpenChange={setIsUpdatingRole}
        invitationId={invitation.id}
        userRole={invitation.role}
        userRoleHierarchy={permissions.currentUserRoleHierarchy}
      />
      <RenewInvitationDialog
        open={isRenewingInvite}
        onOpenChange={setIsRenewingInvite}
        invitationId={invitation.id}
        email={invitation.email}
      />
    </>
  );
};

const getIsInviteExpired = (isoExpiresAt: string) => {
  const currentIsoTime = new Date().toISOString();

  const isoExpiresAtDate = new Date(isoExpiresAt);
  const currentIsoTimeDate = new Date(currentIsoTime);

  return isoExpiresAtDate < currentIsoTimeDate;
};
