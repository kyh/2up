"use client";

import * as React from "react";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
import { toast } from "@init/ui/toast";
import { TrashIcon } from "@radix-ui/react-icons";

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/react";

type Tasks = RouterOutputs["task"]["retrieve"]["data"];

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Tasks;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTasksDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const utils = api.useUtils();
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Tasks deleted");
      onSuccess?.();
      utils.task.retrieve.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            loading={deleteTask.isPending}
            onClick={() => {
              deleteTask.mutate({
                ids: tasks.map((task) => task.id),
              });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
