"use client";

import { useMemo, useState } from "react";
import {
  taskLabels,
  taskPriorities,
  taskStatuses,
} from "@init/api/task/task-schema";
import { alertDialog } from "@init/ui/alert-dialog";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import { Checkbox } from "@init/ui/checkbox";
import { DataTableColumnHeader } from "@init/ui/data-table/data-table-column-header";
import { useDataTable } from "@init/ui/data-table/use-data-table";
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
import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import { TaskForm } from "./task-form";
import { formatDate, getPriorityIcon, getStatusIcon } from "./task-utils";
import { TasksTableActionsBar } from "./tasks-table-actions-bar";

// import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";

type TasksTableProps = {
  teamSlug: string;
  searchParams: GetTasksInput;
};

export const TasksTable = ({ teamSlug, searchParams }: TasksTableProps) => {
  const { data: teamData } = api.team.getTeam.useQuery({
    slug: teamSlug,
  });
  const filter = searchParams.filter ?? [];
  const { data: tasksData } = api.task.getTasks.useQuery(
    {
      ...searchParams,
      filter: [...filter, { field: "teamId", value: teamData?.team?.id ?? "" }],
    },
    {
      enabled: !!teamData?.team,
    },
  );

  const columns = useMemo(() => getColumns(), []);
  const rows = tasksData?.data ?? [];

  const { table } = useDataTable({
    data: rows,
    columns,
  });

  if (!teamData?.team) {
    return null;
  }

  return (
    <>
      <TasksTableActionsBar teamId={teamData.team.id} table={table} />
      <AutoTable table={table} />
    </>
  );
};

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

  const onChangeLabel = (newLabel: string) => {
    updateTask.mutate({ ...task, label: newLabel as TaskLabel });
  };

  const onDeleteTask = () => {
    alertDialog.open(`Remove ${task.title}?`, {
      description: `You are about to remove the task "${task.title}"`,
      action: {
        label: "Remove",
        onClick: () => {
          // removeMember.mutate({ accountId: teamId, userId: member.userId });
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
