"use client";

import React, { useState } from "react";
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

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/react";
import { getColumns } from "./account-members-table-columns";

interface AccountMembersTableProps {
  slug: string;
  currentUserId: string;
  currentAccountId: string;
  userRoleHierarchy: number;
  isPrimaryOwner: boolean;
  canManageRoles: boolean;
}

export function AccountMembersTable({
  slug,
  currentUserId,
  currentAccountId,
  isPrimaryOwner,
  userRoleHierarchy,
  canManageRoles,
}: AccountMembersTableProps) {
  const [search, setSearch] = useState("");

  const [members] = api.team.members.useSuspenseQuery({
    slug,
  });

  const permissions = {
    canUpdateRole: (targetRole: number) => {
      return (
        isPrimaryOwner || (canManageRoles && userRoleHierarchy < targetRole)
      );
    },
    canRemoveFromAccount: (targetRole: number) => {
      return (
        isPrimaryOwner || (canManageRoles && userRoleHierarchy < targetRole)
      );
    },
    canTransferOwnership: isPrimaryOwner,
  };

  const columns = React.useMemo(
    () =>
      getColumns(permissions, {
        currentUserId,
        currentAccountId,
        currentRoleHierarchy: userRoleHierarchy,
      }),
    [permissions, currentUserId, currentAccountId, userRoleHierarchy],
  );

  const filteredMembers = React.useMemo(
    () =>
      members
        .filter((member) => {
          const searchString = search.toLowerCase();
          const displayName = member.name ?? member.email.split("@")[0];

          return (
            displayName.includes(searchString) ||
            member.role.toLowerCase().includes(searchString)
          );
        })
        .sort((prev, next) => {
          if (prev.primary_owner_user_id === prev.user_id) {
            return -1;
          }

          if (prev.role_hierarchy_level < next.role_hierarchy_level) {
            return -1;
          }

          return 1;
        }),
    [members],
  );

  const table = useReactTable({
    data: filteredMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={"flex flex-col space-y-2"}>
      <Input
        value={search}
        onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        placeholder={"Search members"}
      />

      <div className={"rounded-md border"}>
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
            {table.getRowModel().rows?.length ? (
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
                  className={"h-24 text-center"}
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
}
