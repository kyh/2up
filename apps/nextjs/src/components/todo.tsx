"use client";

import type { RouterOutputs } from "@2up/api";
import { cn } from "@2up/ui";
import { Button } from "@2up/ui/button";
import { Checkbox } from "@2up/ui/checkbox";
import { Input } from "@2up/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@2up/ui/table";
import { toast } from "@2up/ui/toast";

import type { TRPCError } from "@/trpc/react";
import { api } from "@/trpc/react";

type Todo = RouterOutputs["todo"]["all"][number];

type TodoListProps = {
  initialTodos: Todo[];
};

const useTodoList = ({ initialTodos }: TodoListProps) => {
  const todos = api.todo.all.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addTodo = api.todo.create.useMutation({
    onSettled: () => todos.refetch(),
  });

  const toggleTodo = api.todo.update.useMutation({
    onSettled: () => todos.refetch(),
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSettled: () => todos.refetch(),
  });

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};

export const TodoList = ({ initialTodos }: TodoListProps) => {
  const vm = useTodoList({
    initialTodos,
  });

  const onAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content")?.toString() ?? "";
    toast.promise(vm.addTodo.mutateAsync({ content }), {
      loading: "Adding todo...",
      success: "Todo added!",
      error: (error: TRPCError) => error.message,
    });
  };

  const onToggleTodo = async (todo: Todo) => {
    toast.promise(
      vm.toggleTodo.mutateAsync({
        id: todo.id,
        content: todo.content,
        completed: !todo.completed,
      }),
      {
        loading: "Updating todo...",
        success: "Todo updated!",
        error: (error: TRPCError) => error.message,
      },
    );
  };

  const onDeleteTodo = async (todo: Todo) => {
    toast.promise(vm.deleteTodo.mutateAsync({ id: todo.id }), {
      loading: "Deleting todo...",
      success: "Todo deleted!",
      error: (error: TRPCError) => error.message,
    });
  };

  return (
    <div className="space-y-4">
      <form className="flex gap-4" onSubmit={onAddTodo}>
        <Input id="content" name="content" placeholder="Go for a run" />
        <Button type="submit">Add Todo</Button>
      </form>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]" />
              <TableHead>Content</TableHead>
              <TableHead className="w-[50px] text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {vm.todos?.data?.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    id={`check-${todo.id}`}
                    checked={!!todo.completed}
                    onCheckedChange={() => onToggleTodo(todo)}
                  />
                </TableCell>
                <TableCell>
                  <label
                    htmlFor={`check-${todo.id}`}
                    className={cn(
                      "flex-1 cursor-pointer",
                      !!todo.completed && "line-through",
                    )}
                  >
                    {todo.content}
                  </label>
                </TableCell>
                <TableCell>
                  <Button
                    className="text-destructive"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTodo(todo)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};