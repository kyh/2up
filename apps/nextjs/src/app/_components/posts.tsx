import { revalidatePath } from "next/cache";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/server";

export const CreatePostForm = () => {
  const createPost = async (formData: FormData) => {
    "use server";

    const title = formData.get("title")?.toString() ?? "";
    const content = formData.get("content")?.toString() ?? "";

    await api.post.create.mutate({ title, content });
    revalidatePath("/");
  };

  return (
    <form
      className="mt-5 flex flex-col gap-4 rounded border p-5"
      action={createPost}
    >
      <input name="title" placeholder="Title" />
      <input name="content" placeholder="Content" />
      <button type="submit">Submit</button>
    </form>
  );
};

type Post = RouterOutputs["post"]["all"][number];

export const PostList = ({ posts }: { posts: Post[] }) => {
  if (posts.length === 0) {
    return <p className="mt-5 text-center">No posts yet</p>;
  }

  return (
    <div className="mt-5 flex w-full flex-col gap-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
};

export const PostCard = (props: { post: Post }) => {
  const onDelete = async () => {
    "use server";
    await api.post.delete.mutate({ id: props.post.id });
    revalidatePath("/");
  };

  return (
    <div className="flex rounded border p-5">
      <div className="flex-grow">
        <h2 className="text-2xl">{props.post.title}</h2>
        <p className="mt-2">{props.post.content}</p>
      </div>
      <form action={onDelete}>
        <button className="text-sm">Delete</button>
      </form>
    </div>
  );
};
