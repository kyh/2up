"use server";

import { revalidatePath } from "next/cache";
import { action } from "@/lib/safe-action";
import { api, schema } from "@/trpc/server";

export const createPost = action(schema.post.postCreateInput, async (input) => {
  await api.post.create.mutate(input);
  revalidatePath("/");
});

export const deletePost = action(schema.post.postDeleteInput, async (input) => {
  await api.post.delete.mutate(input);
  revalidatePath("/");
});
