import { PageHeader } from "@/components/header";
import { api } from "@/trpc/server";
import { TodoList } from "./todo";

// export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all();

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Welcome back</PageHeader>
      <TodoList initialTodos={todos} />
    </main>
  );
};

export default Page;
