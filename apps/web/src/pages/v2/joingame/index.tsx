import React from "react";
import { useRouter } from "next/router";
import { Form, useForm } from "react-hook-form";
import { ButtonV2, TextFieldV2, SideBar } from "~/components";

import { useCheckGame } from "~/lib/game/useGameActions";
import { Header } from "~/components/Header/Header";
import Image from "next/image";
import { Illustrations } from "~/assets/icons/Illustrations";

type FormInputs = {
  gameId: string;
};

export const JoinGame = () => {
  const router = useRouter();
  const { checkGame, isLoading } = useCheckGame();
  const { register, handleSubmit } = useForm<FormInputs>();

  const gameId = router.query.gameId?.toString() || "";

  // const onSubmit = async ({ gameId }: FormInputs) => {
  //   await checkGame(gameId);
  // };

  return (
    <div className="flex flex-col">
      <div className="fixed w-screen z-50">
        <Header />
      </div>

      <div className="flex h-screen">
        <SideBar />

        <div className="flex items-center justify-center w-full bg-container bg-dark-black after:content[''] before:left-0 before:top-0 before:right-0 before:bottom-0 before:absolute before:z-10 before:opacity-[0.95] before:bg-dark-black relative">
          {" "}
          <div className="flex flex-col space-y-4 items-center relative z-50">
            {/* <Form onSubmit={() => handleSubmit(onSubmit)}> */}

            <Illustrations />

            <TextFieldV2
              {...register("gameId", { required: true })}
              type={"text"}
              placeholder={"Enter Game Pin"}
              defaultValue={gameId}
              className="font-mono text-[14px] h-[40px] text-center"
            ></TextFieldV2>
            <ButtonV2
              className="w-[256px] h-[40px]"
              variant="primary"
              size="small"
              type="submit"
            >
              Join Game
            </ButtonV2>
            {/* </Form> */}
          </div>
        </div>
      </div>
    </div>
  );
};
