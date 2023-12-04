"use server";

import { revalidatePath } from "next/cache";
import type { RouterInputs } from "@/trpc/server";
import { api, createServerAction } from "@/trpc/server";

export const createPost = createServerAction(
  async (input: RouterInputs["post"]["create"]) => {
    await api.post.create.mutate(input);
    revalidatePath("/");
  },
);

export const deletePost = createServerAction(
  async (input: RouterInputs["post"]["delete"]) => {
    await api.post.delete.mutate(input);
    revalidatePath("/");
  },
);
