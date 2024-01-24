import { api } from "@/trpc/server";
import { TodoList } from "./todo";

// export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all();

  return (
    <main className="flex flex-1 flex-col px-5">
      <h1 className="my-8 text-xl">Welcome back</h1>
      <TodoList initialTodos={todos} />
    </main>
  );
};

export default Page;
