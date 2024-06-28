"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  TaskLabels,
  TaskPriorites,
  TaskStatuses,
} from "@init/api/task/task-schema";
import { formatDate } from "@init/api/task/task-util";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import { Checkbox } from "@init/ui/checkbox";
import { DataTableColumnHeader } from "@init/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { toast } from "@init/ui/toast";
import { MoreHorizontalIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import { getPriorityIcon, getStatusIcon } from "../_lib/utils";
import { DeleteTasksDialog } from "./delete-tasks-dialog";
import { UpdateTaskSheet } from "./update-task-sheet";

type Task = RouterOutputs["task"]["retrieve"]["data"][0];

export const getColumns = (): ColumnDef<Task>[] => [
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
      const label = TaskLabels.find(
        (label: string) => label === row.original.label,
      );

      return (
        <div className="flex space-x-2">
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
      const status = TaskStatuses.find(
        (status) => status === row.original.status,
      );

      if (!status) return null;

      const Icon = getStatusIcon(status as Task["status"]);

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
      const priority = TaskPriorites.find(
        (priority) => priority === row.original.priority,
      );

      if (!priority) return null;

      const Icon = getPriorityIcon(priority as Task["priority"]);

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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const utils = api.useUtils();
      const updateTask = api.task.update.useMutation({
        onSuccess: () => {
          toast.success("Label updated");
          utils.task.retrieve.invalidate();
        },
        onError: (error) => toast.error(error.message),
      });
      const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
        React.useState(false);
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
        React.useState(false);

      return (
        <>
          <UpdateTaskSheet
            open={showUpdateTaskSheet}
            onOpenChange={setShowUpdateTaskSheet}
            task={row.original}
          />
          <DeleteTasksDialog
            open={showDeleteTaskDialog}
            onOpenChange={setShowDeleteTaskDialog}
            tasks={[row.original]}
            showTrigger={false}
            onSuccess={() => row.toggleSelected(false)}
          />
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
              <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) => {
                      updateTask.mutate({
                        id: row.original.id,
                        label: value as Task["label"],
                      });
                    }}
                  >
                    {TaskLabels.map((label) => (
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
              <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
