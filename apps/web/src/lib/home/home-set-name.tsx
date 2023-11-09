import { classed } from "@/lib/utils/classed";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Avatar, Link, Button, Input } from "@/components";
import { useHomeStore } from "@/lib/home/home-store";
import { useJoinGame } from "@/lib/game/use-game-actions";
import { Form } from "@/lib/home/components/form";

type FormInputs = {
  name: string;
};

export const HomeSetName = () => {
  const searchParams = useSearchParams();
  const playerName = useHomeStore((state) => state.playerName);
  const { joinGame } = useJoinGame();
  const { register, watch, handleSubmit } = useForm<FormInputs>();

  const gameId = searchParams.get("gameId") || "0";
  const watchName = watch("name");

  const onSubmit = ({ name }: FormInputs) => {
    joinGame(gameId, name);
  };

  return (
    <SectionBody>
      <Form className="gap-1" onSubmit={handleSubmit(onSubmit)}>
        <Avatar name={watchName} type="setName" />
        <Input
          className="mb-1"
          {...register("name", { required: true })}
          placeholder="Player Name"
          defaultValue={playerName}
          autoFocus
        />
        <Button className="mb-2 px-4" type="submit">
          Lets go!
        </Button>
      </Form>
      <StartNewGameText>
        Or{" "}
        <Link
          className="ml-[5px] underline"
          href={{
            pathname: `/game/${gameId}/spectate/lobby`,
          }}
        >
          spectate this game
        </Link>
      </StartNewGameText>
    </SectionBody>
  );
};

const SectionBody = classed.div("flex flex-col min-h-[300px]");

export const StartNewGameText = classed.div("flex justify-center mt-auto");
