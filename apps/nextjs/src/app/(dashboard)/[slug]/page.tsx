import { TodoList } from "@/components/todo";
import { api } from "@/trpc/server";

// export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all();

  return <TodoList initialTodos={todos} />;
};

export default Page;
