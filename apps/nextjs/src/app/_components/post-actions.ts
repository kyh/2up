"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/trpc/server";

export const createPost = async (formData: FormData) => {
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";

  await api.post.create.mutate({ title, content });
  revalidatePath("/");
};

export const deletePost = async (postId: string) => {
  await api.post.delete.mutate({ id: postId });
  revalidatePath("/");
};
