import { api } from "~/trpc/server";
import { Auth } from "./_components/auth";
import { CreatePostForm, PostList } from "./_components/posts";

export const runtime = "edge";

const Page = async () => {
  const posts = await api.post.all.query();

  return (
    <main className="container mx-auto max-w-4xl p-10">
      <nav className="flex items-center justify-between">
        <h1 className="text-xl">T3 Template</h1>
        <Auth />
      </nav>
      <CreatePostForm />
      <PostList posts={posts} />
    </main>
  );
};

export default Page;
