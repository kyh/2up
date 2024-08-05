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

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
};

export const DataTableViewOptions = <TData,>({
  table,
}: DataTableViewOptionsProps<TData>) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        aria-label="Toggle columns"
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <EyeIcon className="mr-2 size-4" />
        View
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
