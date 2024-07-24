"use client";

import type { RouterOutputs } from "@init/api";
import type { Table } from "@tanstack/react-table";
import { CreateTaskDialog } from "./create-task-dialog";
import { DeleteTasksDialog } from "./delete-tasks-dialog";

type Task = RouterOutputs["task"]["retrieve"]["data"][0];

type TasksTableToolbarActionsProps = {
  accountId: string;
  table: Table<Task>;
};

export const TasksTableToolbarActions = ({
  accountId,
  table,
}: TasksTableToolbarActionsProps) => (
  <div className="flex items-center gap-2">
    {table.getFilteredSelectedRowModel().rows.length > 0 ? (
      <DeleteTasksDialog
        tasks={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    ) : null}
    <CreateTaskDialog accountId={accountId} />
    {/**
     * Other actions can be added here.
     * For example, import, view, etc.
     */}
  </div>
);
