"use client";

import { useMemo } from "react";
import Link from "next/link";
import { RouterOutputs } from "@init/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@init/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Memberships = RouterOutputs["admin"]["getMemberships"];

export function AdminMembershipsTable(props: { memberships: Memberships }) {
  const columns = useMemo(() => getColumns(), []);
  const table = useReactTable({
    data: props.memberships,
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
          {table.getRowModel().rows?.length ? (
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
}

function getColumns(): ColumnDef<Memberships[0]>[] {
  return [
    {
      header: "User ID",
      accessorKey: "user_id",
    },
    {
      header: "Team",
      cell: ({ row }) => {
        return (
          <Link
            className={"hover:underline"}
            href={`/admin/accounts/${row.original.account_id}`}
          >
            {row.original.account.name}
          </Link>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "account_role",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
    },
  ];
}
