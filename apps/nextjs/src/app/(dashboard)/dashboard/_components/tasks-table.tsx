"use client";

import * as React from "react";
import { RetrieveInput } from "@init/api/task/task-schema";
import { DataTable } from "@init/ui/data-table/data-table";
import { DataTableToolbar } from "@init/ui/data-table/data-table-toolbar";

import type { RouterOutputs } from "@init/api";
import { useDataTable } from "@/hooks/use-data-table";
import { api } from "@/trpc/react";
import { getColumns } from "./tasks-table-columns";
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";

type Tasks = RouterOutputs["task"]["retrieve"];

interface TasksTableProps {
  tasksPromise: Promise<Tasks>;
  searchParams: RetrieveInput;
}

export function TasksTable(props: TasksTableProps) {
  // Memoize the columns so they don't re-render on every render

  const initialData = React.use(props.tasksPromise);
  const { data } = api.task.retrieve.useQuery(props.searchParams, {
    initialData,
  });

  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: data.data,
    columns,
    pageCount: data.pageCount,
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
