"use client";

import { useState } from "react";
import { Button } from "@init/ui/button";
import { DataTableViewOptions } from "@init/ui/data-table/data-table-view-options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
import { PlusIcon } from "lucide-react";

import type { Task } from "./task-utils";
import type { Table } from "@tanstack/react-table";
import { TaskForm } from "./task-form";

type TasksTableActionsBarProps = {
  teamId: string;
  table: Table<Task>;
};

export const TasksTableActionsBar = ({
  teamId,
  table,
}: TasksTableActionsBarProps) => {
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <DeleteTasksDialog
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      )} */}
      <Dialog
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
      >
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new task.
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            teamId={teamId}
            onSuccess={() => setShowCreateTaskDialog(false)}
          />
        </DialogContent>
      </Dialog>
      <DataTableViewOptions table={table} />
    </div>
  );
};
