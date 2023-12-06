"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

export const TodoCreateForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isTransitioning, startTransion] = useTransition();
  const { mutate, isPending } = api.todo.create.useMutation({
    onSuccess: () => {
      startTransion(() => {
        router.refresh();
        formRef.current?.reset();
      });
    },
    onError: (e) => {
      console.error(e.message);
      alert("Error creating");
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content")?.toString() ?? "";
    mutate({ content });
  };

  const isLoading = isPending || isTransitioning;

  return (
    <form
      className="mt-5 flex flex-col gap-4 rounded border p-5"
      ref={formRef}
      onSubmit={onSubmit}
    >
      <h2>Add TODO</h2>
      <input name="content" placeholder="Content" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Submit"}
      </button>
    </form>
  );
};

export const TodoDeleteButton = ({ todoId }: { todoId: string }) => {
  const router = useRouter();
  const [isTransitioning, startTransion] = useTransition();
  const { mutate, isPending } = api.todo.delete.useMutation({
    onSuccess: () => {
      startTransion(() => router.refresh());
    },
    onError: (e) => {
      console.error(e.message);
      alert("Error deleting");
    },
  });

  const onClick = () => {
    mutate({ id: todoId });
  };

  const isLoading = isPending || isTransitioning;

  return (
    <button
      type="button"
      className="text-sm"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};
