"use client";

import {
  createTaskInput,
  taskLabels,
  taskPriorities,
  taskStatuses,
} from "@init/api/task/task-schema";
import { Button } from "@init/ui/button";
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

import type { Task } from "./task-utils";
import type { CreateTaskInput } from "@init/api/task/task-schema";
import { api } from "@/trpc/react";

type TaskFormProps = {
  teamId: string;
  task?: Task;
  onSuccess?: () => void;
};

export const TaskForm = ({ teamId, task, onSuccess }: TaskFormProps) => {
  const createTask = api.task.createTask.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const updateTask = api.task.updateTask.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: createTaskInput,
    defaultValues: {
      title: task?.title ?? "",
      label: task?.label ?? "bug",
      status: task?.status ?? "todo",
      priority: task?.priority ?? "low",
      teamId,
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    if (task) {
      const promise = updateTask.mutateAsync({ ...data, id: task.id });
      toast.promise(promise, {
        loading: "Updating task...",
        success: "Task updated",
        error: "Could not update task. Please try again.",
      });
      form.reset();
      onSuccess?.();
      return;
    } else {
      const promise = createTask.mutateAsync({ ...data, teamId });
      toast.promise(promise, {
        loading: "Creating task...",
        success: "Task created",
        error: "Could not create task. Please try again.",
      });
      onSuccess?.();
    }
  };

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {taskLabels.map((item) => (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {taskStatuses.map((item) => (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {taskPriorities.map((item) => (
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
        <footer className="gap-2 pt-2 sm:gap-0">
          <Button loading={createTask.isPending}>
            {task ? "Update" : "Create"}
          </Button>
        </footer>
      </form>
    </Form>
  );
};
