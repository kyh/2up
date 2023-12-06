import { Auth } from "@/app/_components/auth";
import type { RouterOutputs } from "@/trpc/server";
import { api } from "@/trpc/server";
import { TodoCreateForm, TodoDeleteButton } from "./_components/todo";

export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all.query();

  return (
    <main className="container mx-auto max-w-4xl p-10">
      <nav className="flex items-center justify-between">
        <h1 className="text-xl">T3 Template</h1>
        <Auth />
      </nav>
      <TodoCreateForm />
      <TodoList todos={todos} />
    </main>
  );
};

const TodoList = ({ todos }: { todos: RouterOutputs["todo"]["all"] }) => {
  if (todos.length === 0) {
    return <p className="mt-5 text-center">No todos yet</p>;
  }

  return (
    <div className="mt-5 flex w-full flex-col gap-4">
      {todos.map((todo) => (
        <div key={todo.id} className="flex rounded border p-5">
          <div className="flex-grow">
            <p className="mt-2">{todo.content}</p>
          </div>
          <TodoDeleteButton todoId={todo.id} />
        </div>
      ))}
    </div>
  );
};

export default Page;
