"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { If } from "@init/ui/if";
import { MoreHorizontalIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { ColumnDef } from "@tanstack/react-table";
import { AdminDeleteAccountDialog } from "./admin-delete-account-dialog";
import { AdminDeleteUserDialog } from "./admin-delete-user-dialog";
import { AdminImpersonateUserDialog } from "./admin-impersonate-user-dialog";

type Account = RouterOutputs["admin"]["getAccounts"]["data"][0];

export const getColumns = (): ColumnDef<Account>[] => [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          className="hover:underline"
          href={`/admin/accounts/${row.original.id}`}
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      return row.original.isPersonalAccount ? "Personal" : "Team";
    },
  },
  {
    id: "createdAt",
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    id: "updated_at",
    header: "Updated At",
    accessorKey: "updatedAt",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [showImpersonateUserDialog, setShowImpersonateUserDialog] =
        useState(false);
      const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
      const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false);

      const isPersonalAccount = row.original.isPersonalAccount;
      const userId = row.original.id;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontalIcon className="h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    className="h-full w-full"
                    href={`/admin/accounts/${userId}`}
                  >
                    View
                  </Link>
                </DropdownMenuItem>
                <If condition={isPersonalAccount}>
                  <DropdownMenuItem
                    onSelect={() => setShowImpersonateUserDialog(true)}
                  >
                    Impersonate User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteUserDialog(true)}
                  >
                    Delete Personal Account
                  </DropdownMenuItem>
                </If>
                <If condition={!isPersonalAccount}>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteTeamDialog(true)}
                  >
                    Delete Team Account
                  </DropdownMenuItem>
                </If>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <If condition={isPersonalAccount}>
            <AdminImpersonateUserDialog
              open={showImpersonateUserDialog}
              onOpenChange={setShowImpersonateUserDialog}
              userId={userId}
            />
            <AdminDeleteUserDialog
              open={showDeleteUserDialog}
              onOpenChange={setShowDeleteUserDialog}
              userId={userId}
            />
          </If>
          <If condition={!isPersonalAccount}>
            <AdminDeleteAccountDialog
              open={showDeleteTeamDialog}
              onOpenChange={setShowDeleteTeamDialog}
              accountId={row.original.id}
            />
          </If>
        </>
      );
    },
  },
];
