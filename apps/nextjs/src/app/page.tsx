import { Auth } from "@/app/_components/auth";
import { api } from "@/trpc/server";

import { PostCreateForm, PostList } from "./_components/post";

export const runtime = "edge";

const Page = async () => {
  const posts = await api.post.all.query();

  return (
    <main className="container mx-auto max-w-4xl p-10">
      <nav className="flex items-center justify-between">
        <h1 className="text-xl">T3 Template</h1>
        <Auth />
      </nav>
      <PostCreateForm />
      <PostList posts={posts} />
    </main>
  );
};

export default Page;
