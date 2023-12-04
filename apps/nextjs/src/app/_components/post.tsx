"use client";

import type { RouterOutputs } from "@/trpc/react";
import { useAction } from "next-safe-action/hook";

import { createPost, deletePost } from "./post-actions";

export const PostCreateForm = () => {
  const { execute, status } = useAction(createPost, {
    onError: (err) => {
      console.error(err);
      alert("error creating post");
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString() ?? "";
    const content = formData.get("content")?.toString() ?? "";

    execute({ title, content });
  };

  const pending = status === "executing";

  return (
    <form
      className="mt-5 flex flex-col gap-4 rounded border p-5"
      onSubmit={onSubmit}
    >
      <input name="title" placeholder="Title" />
      <input name="content" placeholder="Content" />
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Submit"}
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
      {posts.map((post) => (
        <div key={post.id} className="flex rounded border p-5">
          <div className="flex-grow">
            <h2 className="text-2xl">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
          </div>
          <PostDeleteForm postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export const PostDeleteForm = ({ postId }: { postId: string }) => {
  const { execute, status } = useAction(deletePost, {
    onError: (err) => {
      console.error(err);
      alert("error deleting post");
    },
  });

  const onClick = () => {
    execute({ id: postId });
  };

  const pending = status === "executing";

  return (
    <button
      type="button"
      className="text-sm"
      disabled={pending}
      onClick={onClick}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
};
