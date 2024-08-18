"use client";

import { useMemo } from "react";
import { DataTable } from "@init/ui/data-table/data-table";
import { DataTableToolbar } from "@init/ui/data-table/data-table-toolbar";

import type { GetTaskListInput } from "@init/api/task/task-schema";
import { useDataTable } from "@/lib/use-data-table";
import { api } from "@/trpc/react";
import { getColumns } from "./tasks-table-columns";
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";

type TasksTableProps = {
  accountId: string;
  searchParams: GetTaskListInput;
};

export const TasksTable = ({ accountId, searchParams }: TasksTableProps) => {
  const [{ data, pageCount }] = api.task.getTaskList.useSuspenseQuery({
    ...searchParams,
    accountId: accountId,
  });

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: data,
    columns,
    pageCount: pageCount,
    // optional props
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <TasksTableToolbarActions accountId={accountId} table={table} />
      </DataTableToolbar>
    </DataTable>
  );
};
