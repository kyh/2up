"use client";

import { toast } from "sonner";

import type { RouterOutputs } from "@acme/api";

import type { TRPCError } from "@/trpc/react";
import { clx } from "@/lib/clx";
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
    <section className="mx-auto max-w-lg px-4 py-8">
      <form className="relative flex items-center text-sm" onSubmit={onAddTodo}>
        <input
          id="content"
          name="content"
          className="block w-full rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300"
          placeholder="Go for a run"
        />
        <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
          <button
            type="submit"
            className="rounded bg-gray-600 px-3 py-1 text-sm text-white shadow-sm transition hover:bg-gray-500"
          >
            Add Todo
          </button>
        </div>
      </form>
      <ul className="my-3 divide-y divide-gray-100">
        {vm.todos?.data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 py-4">
            <input
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-600"
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => onToggleTodo(todo)}
            />
            <label
              htmlFor={`check-${todo.id}`}
              className={clx(
                "flex-1 cursor-pointer",
                !!todo.completed && "line-through",
              )}
            >
              {todo.content}
            </label>
            <button
              className="rounded-full bg-white px-2.5 py-1 text-xs text-red-900 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
              onClick={() => onDeleteTodo(todo)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
