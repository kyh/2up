"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Database } from "@init/db/database.types";
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
import { TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { api } from "@/trpc/react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<Task>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTasksDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const router = useRouter();

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Tasks deleted");
      onSuccess?.();
      router.refresh();
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
