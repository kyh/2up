"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Link, Button, Input, Modal } from "@/components";
import { Form } from "@/lib/home/components/form";
import { HomeSetName, StartNewGameText } from "@/lib/home/home-set-name";
import { useCheckGame } from "@/lib/game/use-game-actions";

type FormInputs = {
  gameId: string;
};

export const HomeJoinGame = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkGame, isLoading } = useCheckGame();
  const { register, handleSubmit } = useForm<FormInputs>();

  const gameId = searchParams.get("gameId") || "";

  // Joining an existing game:
  const onSubmit = async ({ gameId }: FormInputs) => {
    await checkGame(gameId);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          className="mb-3"
          {...register("gameId", { required: true })}
          type="tel"
          placeholder="Game Code"
          defaultValue={gameId}
        />
        <Button className="mb-2" type="submit" disabled={isLoading}>
          Join existing game
        </Button>
      </Form>
      <StartNewGameText>
        Or{" "}
        <Link className="ml-1 underline" href="/packs">
          start your own game
        </Link>
      </StartNewGameText>
      <Modal
        open={searchParams.get("join") ? true : false}
        title="What should we call you?"
        onClose={() => {
          router.replace(`/?gameId=${gameId}`);
        }}
        maxWidth={400}
        closeButton
      >
        <HomeSetName />
      </Modal>
    </div>
  );
};
