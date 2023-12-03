"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

export const CreatePostForm = () => {
  const router = useRouter();
  const createPost = api.post.create.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString() ?? "";
    const content = formData.get("content")?.toString() ?? "";

    await createPost.mutateAsync({ title, content });

    form.reset();
    router.refresh();
  };

  return (
    <form
      className="mt-5 flex flex-col gap-4 rounded border p-5"
      onSubmit={onSubmit}
    >
      <input name="title" placeholder="Title" />
      <input name="content" placeholder="Content" />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
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
  const router = useRouter();
  const deletePost = api.post.delete.useMutation();

  const onDelete = async () => {
    await deletePost.mutateAsync(props.post.id);
    router.refresh();
  };

  return (
    <div className="flex rounded border p-5">
      <div className="flex-grow">
        <h2 className="text-2xl">{props.post.title}</h2>
        <p className="mt-2">{props.post.content}</p>
      </div>
      <div>
        <button className="text-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};
