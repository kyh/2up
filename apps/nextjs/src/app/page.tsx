import { Auth } from "@/app/_components/auth";
import { api } from "@/trpc/server";
import { TodoList } from "./_components/todo";

export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all.query();

  return (
    <main className="container mx-auto max-w-4xl p-10">
      <nav className="flex items-center justify-between">
        <h1 className="text-xl">T3 Template</h1>
        <Auth />
      </nav>
      <TodoList initialTodos={todos} />
    </main>
  );
};

export default Page;
