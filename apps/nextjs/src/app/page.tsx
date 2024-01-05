import { UserNav } from "@/components/nav";
import { TodoList } from "@/components/todo";
import { api } from "@/trpc/server";

// export const runtime = "edge";

const Page = async () => {
  const todos = await api.todo.all();

  return (
    <main className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">App Template</h2>
          <p className="text-muted-foreground">
            Here&apos;s an example list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UserNav />
        </div>
      </div>
      <TodoList initialTodos={todos} />
    </main>
  );
};

export default Page;
