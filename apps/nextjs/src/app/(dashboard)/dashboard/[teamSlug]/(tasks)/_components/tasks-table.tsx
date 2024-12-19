"use client";

import { useState } from "react";
import {
  taskLabels,
  taskPriorities,
  taskStatuses,
} from "@init/api/task/task-schema";
import { DataTableColumnHeader } from "@init/data-table/components/data-table-column-header";
import { DataTableFilterList } from "@init/data-table/components/data-table-filter-list";
import { DataTablePagination } from "@init/data-table/components/data-table-pagination";
import { DataTableSortList } from "@init/data-table/components/data-table-sort-list";
import { DataTableViewOptionsButton } from "@init/data-table/components/data-table-view-options";
import { useDataTable } from "@init/data-table/components/use-data-table";
import { alertDialog } from "@init/ui/alert-dialog";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import { Checkbox } from "@init/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { AutoTable } from "@init/ui/table";
import { toast } from "@init/ui/toast";
import { MoreHorizontalIcon } from "lucide-react";

import type { Task } from "./task-utils";
import type { GetTasksInput, TaskLabel } from "@init/api/task/task-schema";
import type { DataTableFilterField } from "@init/data-table/types";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import { TaskForm, TasksTableAddTaskButton } from "./task-form";
import { formatDate, getPriorityIcon, getStatusIcon } from "./task-utils";
import { TasksTableActionBar } from "./tasks-table-action-bar";

type TasksTableProps = {
  teamId: string;
  getTasksInput: GetTasksInput;
};

export const TasksTable = ({ teamId, getTasksInput }: TasksTableProps) => {
  const [{ tasks, pageCount }] =
    api.task.getTasks.useSuspenseQuery(getTasksInput);

  const { table } = useDataTable({
    data: tasks,
    columns,
    pageCount,
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <div className="space-y-2">
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        <div className="flex items-center gap-2">
          <DataTableFilterList table={table} filterFields={filters} />
          <DataTableSortList table={table} />
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptionsButton table={table} />
          <TasksTableAddTaskButton teamId={teamId} table={table} />
        </div>
      </div>
      <AutoTable table={table} />
      <DataTablePagination table={table} />
      <TasksTableActionBar table={table} />
    </div>
  );
};

const filters: DataTableFilterField<Task>[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
  },
  {
    id: "status",
    label: "Status",
    type: "multi-select",
    options: taskStatuses.map((status) => ({
      label: status,
      value: status,
      icon: getStatusIcon(status),
    })),
  },
  {
    id: "priority",
    label: "Priority",
    type: "multi-select",
    options: taskPriorities.map((priority) => ({
      label: priority,
      value: priority,
      icon: getPriorityIcon(priority),
    })),
  },
  {
    id: "createdAt",
    label: "Created at",
    type: "date",
  },
];

const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = taskLabels.find(
        (label: string) => label === row.original.label,
      );

      return (
        <div className="flex gap-2">
          {label && <Badge variant="outline">{label}</Badge>}
          <span className="max-w-[31.25rem] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = taskStatuses.find(
        (status) => status === row.original.status,
      );

      if (!status) return null;

      const Icon = getStatusIcon(status);

      return (
        <div className="flex w-[6.25rem] items-center">
          <Icon
            className="mr-2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = taskPriorities.find(
        (priority) => priority === row.original.priority,
      );

      if (!priority) return null;

      const Icon = getPriorityIcon(priority);

      return (
        <div className="flex items-center">
          <Icon
            className="mr-2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="capitalize">{priority}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsDropdown task={row.original} />;
    },
  },
];

const ActionsDropdown = ({ task }: { task: Task }) => {
  const [showUpdateTaskDialog, setShowUpdateTaskDialog] = useState(false);
  const updateTask = api.task.updateTask.useMutation();
  const deleteTask = api.task.deleteTask.useMutation();

  const onChangeLabel = (newLabel: string) => {
    const promise = updateTask.mutateAsync({
      ...task,
      label: newLabel as TaskLabel,
    });
    toast.promise(promise, {
      loading: "Updating label...",
      success: "Label updated successfully",
      error: "Failed to update label",
    });
  };

  const onDeleteTask = () => {
    alertDialog.open(`Remove ${task.title}?`, {
      description: `You are about to remove the task "${task.title}"`,
      action: {
        label: "Remove",
        onClick: () => {
          const promise = deleteTask.mutateAsync({ id: task.id });
          toast.promise(promise, {
            loading: "Removing task...",
            success: "Task removed successfully",
            error: "Failed to remove task",
          });
          return promise;
        },
      },
    });
  };

  return (
    <Dialog open={showUpdateTaskDialog} onOpenChange={setShowUpdateTaskDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DialogTrigger asChild>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={task.label}
                onValueChange={onChangeLabel}
              >
                {taskLabels.map((label) => (
                  <DropdownMenuRadioItem
                    key={label}
                    value={label}
                    className="capitalize"
                    disabled={updateTask.isPending}
                  >
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onDeleteTask}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>Update the task details below.</DialogDescription>
        </DialogHeader>
        <TaskForm
          teamId={task.teamId}
          task={task}
          onSuccess={() => setShowUpdateTaskDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
