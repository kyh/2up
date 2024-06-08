"use client";

import * as React from "react";
import { Database } from "@init/db/database.types";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./tasks-table-columns";
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TasksTableProps {
  data: Task[];
  pageCount: number;
}

export function TasksTable({ data, pageCount }: TasksTableProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    // optional props
    defaultPerPage: 10,
    defaultSort: "created_at.desc",
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <TasksTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
