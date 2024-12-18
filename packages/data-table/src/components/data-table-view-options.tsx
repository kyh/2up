"use client";

import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { EyeIcon } from "lucide-react";

import type { Table } from "@tanstack/react-table";

type DataTableViewOptionsButton<TData> = {
  table: Table<TData>;
};

export const DataTableViewOptionsButton = <TData,>({
  table,
}: DataTableViewOptionsButton<TData>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <EyeIcon className="mr-1 size-4" />
        Columns
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-40">
      {table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        )
        .map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              <span className="truncate">{column.id}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
    </DropdownMenuContent>
  </DropdownMenu>
);
