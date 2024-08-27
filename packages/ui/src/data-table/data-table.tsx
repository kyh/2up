import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@init/ui/table";
import { cn } from "@init/ui/utils";
import { flexRender } from "@tanstack/react-table";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export const DataTable = <TData,>({
  table,
  className,
  ...props
}: DataTableProps<TData>) => (
  <div
    className={cn("flex w-full flex-1 flex-col gap-2", className)}
    {...props}
  >
    <div className="flex-1 rounded-md border">
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
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex flex-col gap-3">
      <DataTablePagination table={table} />
    </div>
  </div>
);
