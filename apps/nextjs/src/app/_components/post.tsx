"use client";

import type { RouterOutputs } from "@/trpc/react";
import { useFormStatus } from "react-dom";

import { createPost, deletePost } from "./post-actions";

export const PostCreateForm = () => {
  return (
    <form
      className="mt-5 flex flex-col gap-4 rounded border p-5"
      action={createPost}
    >
      <input name="title" placeholder="Title" />
      <input name="content" placeholder="Content" />
      <PostCreateButton />
    </form>
  );
};

const PostCreateButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Submit"}
    </button>
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
  const deleteAction = deletePost.bind(null, postId);

  return (
    <form action={deleteAction}>
      <PostDeleteButton />
    </form>
  );
};

const PostDeleteButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="text-sm" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
};
