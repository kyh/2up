"use client";

import { useState } from "react";
import {
  createTaskInput,
  TaskLabels,
  TaskPriorites,
  TaskStatuses,
} from "@init/api/task/task-schema";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@init/ui/select";
import { Textarea } from "@init/ui/textarea";
import { toast } from "@init/ui/toast";
import { PlusIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { CreateTaskInput } from "@init/api/task/task-schema";
import { api } from "@/trpc/react";

type Task = RouterOutputs["task"]["getTaskList"]["data"][0];

type CreateTaskDialogProps = {
  accountId?: string;
  task?: Task;
  showTrigger?: boolean;
  onSuccess?: () => void;
} & React.ComponentPropsWithRef<typeof Dialog>;

export const CreateTaskDialog = ({
  accountId,
  task,
  showTrigger = true,
  onSuccess,
  ...props
}: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);

  const createTask = api.task.createTask.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast.success("Task created");
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateTask = api.task.updateTask.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast.success("Task updated");
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: createTaskInput,
    defaultValues: {
      title: task?.title ?? "",
      label: task?.label ?? "bug",
      status: task?.status ?? "todo",
      priority: task?.priority ?? "low",
    },
  });

  const onSubmit = (input: CreateTaskInput) => {
    if (task) {
      updateTask.mutate({ ...input, id: task.id });
    } else {
      createTask.mutate({ ...input, accountId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            {task ? "Update task" : "New task"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Update task" : "Create task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details below to update the task."
              : "Fill in the details below to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Do a kickflip"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {TaskLabels.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {TaskStatuses.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {TaskPriorites.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button loading={createTask.isPending}>
                {task ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
