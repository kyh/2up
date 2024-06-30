"use client";

import * as React from "react";
import { cn } from "@init/ui/utils";

import type { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./data-table-view-options";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
} & React.HTMLAttributes<HTMLDivElement>;

export const DataTableToolbar = <TData,>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) => (
  <div
    className={cn(
      "flex w-full items-center justify-end space-x-2 overflow-auto p-1",
      className,
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      <DataTableViewOptions table={table} />
    </div>
  </div>
);
