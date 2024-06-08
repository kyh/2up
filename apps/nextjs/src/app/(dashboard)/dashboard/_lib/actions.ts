"use server";

import { revalidatePath } from "next/cache";
import {
  CreateInput,
  DeleteInput,
  UpdateInput,
} from "@init/api/task/task-schema";

import { getErrorMessage } from "@/lib/handle-error";
import { api } from "@/trpc/server";

export async function createTask(input: CreateInput) {
  try {
    await api.task.create(input);
    revalidatePath("/dashboard");
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateTask(input: UpdateInput) {
  try {
    await api.task.update(input);
    revalidatePath("/dashboard");
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTasks(input: DeleteInput) {
  try {
    await api.task.delete(input);
    revalidatePath("/dashboard");
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
