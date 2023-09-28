"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
import { Button, TextField, SideBar } from "../../components";

import { Header } from "~/app/components/Header";
// import { useCheckGame } from "~/lib/game/use-game-actions";

type FormInputs = {
  gameId: string;
};

export const JoinGame = () => {
  const searchParams = useSearchParams();
  // const { checkGame, isLoading } = useCheckGame();
  // const { register, handleSubmit } = useForm<FormInputs>();
  const gameId = searchParams?.get("gameId") || "";

  return (
    <div className="flex flex-col">
      <div className="fixed z-50 w-screen">
        <Header />
      </div>

      <div className="flex h-screen">
        <SideBar />

        <div className="after:content[''] relative flex w-full items-center justify-center bg-dark-black bg-container before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10 before:bg-dark-black before:opacity-[0.95]">
          {" "}
          <div className="relative z-50 flex flex-col items-center space-y-4">
            {/** TODO(monfernape): add illustrations */}
            {/* <Illustrations /> */}

            <TextField
              // {...register("gameId", { required: true })}
              type={"text"}
              placeholder={"Enter Game Pin"}
              defaultValue={gameId}
              className="h-[40px] text-center font-mono text-[14px]"
            ></TextField>
            <Button
              className="h-[40px] w-[256px]"
              variant="primary"
              size="small"
              type="submit"
            >
              Join Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
