"use client";

import type { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/react";

export const TodoList = ({
  initialTodos,
}: {
  initialTodos: RouterOutputs["todo"]["all"];
}) => {
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content")?.toString() ?? "";
    addTodo.mutate({ content });
  };

  return (
    <div>
      <ul className="my-5 flex flex-col gap-3">
        {todos?.data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => {
                toggleTodo.mutate({
                  id: todo.id,
                  content: todo.content,
                  completed: !todo.completed,
                });
              }}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
            <button
              className="ml-auto text-sm text-red-500"
              onClick={() => {
                deleteTodo.mutate({ id: todo.id });
              }}
            >
              (Delete)
            </button>
          </li>
        ))}
      </ul>
      <form
        className="relative mt-2 flex items-center text-sm"
        onSubmit={onSubmit}
      >
        <input
          id="content"
          name="content"
          className="block w-full rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300"
          placeholder="Go for a run"
        />
        <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
          <button
            type="submit"
            className="inline-flex items-center rounded border border-gray-200 px-2"
          >
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
};
