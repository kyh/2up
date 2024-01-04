import { UserNav } from "@/components/nav";
import { TodoList } from "@/components/todo";
import { api } from "@/trpc/server";

// export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all.query();

  return (
    <main className="container mx-auto max-w-4xl p-10">
      <nav className="flex items-center justify-between">
        <h1 className="text-xl">App Template</h1>
        <UserNav />
      </nav>
      <TodoList initialTodos={todos} />
    </main>
  );
};

export default Page;
