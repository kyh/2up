"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProfileAvatar } from "@init/ui/profile-avatar";
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
import type { ColumnDef } from "@tanstack/react-table";

type Members = RouterOutputs["admin"]["getMembers"];

export const AdminMembersTable = (props: { members: Members }) => {
  const columns = useMemo(() => getColumns(), []);
  const table = useReactTable({
    data: props.members,
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

const getColumns = (): ColumnDef<Members[0]>[] => [
  {
    header: "User ID",
    accessorKey: "userId",
  },
  {
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <div className="flex items-center space-x-2">
          <div>
            <ProfileAvatar
              pictureUrl={row.original.pictureUrl}
              displayName={name}
            />
          </div>

          <Link
            className="hover:underline"
            href={`/admin/accounts/${row.original.id}`}
          >
            <span>{name}</span>
          </Link>
        </div>
      );
    },
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    cell: ({ row }) => {
      return row.original.role;
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
  },
];
