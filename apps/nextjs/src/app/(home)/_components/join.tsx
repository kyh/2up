"use client";

import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

export const JoinGameForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = api.game.check.useMutation();

  const onCheckGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameCode = formData.get("code") as string;
    const response = await mutateAsync({ gameCode });
    router.push(`/game?code=${response.code}`);
  };

  return (
    <form className="mb-5 flex gap-2" onSubmit={onCheckGame}>
      <input className="flex-1" id="code" name="code" />
      <button className="bg-gray-700 p-2 text-xs" disabled={isPending}>
        Join Game
      </button>
    </form>
  );
};
