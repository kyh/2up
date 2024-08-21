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
  searchParams: GetTaskListInput;
  accountSlug?: string;
};

export const TasksTable = ({ accountSlug, searchParams }: TasksTableProps) => {
  const { data: teamWorkspaceData } = api.account.teamWorkspace.useQuery(
    {
      slug: accountSlug ?? "",
    },
    { enabled: !!accountSlug },
  );

  const account = teamWorkspaceData?.account;

  const { data: taskListData } = api.task.getTaskList.useQuery({
    ...searchParams,
    accountId: account?.id,
  });

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: taskListData?.data ?? [],
    columns,
    pageCount: taskListData?.pageCount ?? 0,
    // optional props
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <TasksTableToolbarActions accountId={account?.id} table={table} />
      </DataTableToolbar>
    </DataTable>
  );
};
