import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Link, Button, Input, Modal } from "~/components";
import { Form } from "~/lib/home/components/Form";
import { HomeSetName, StartNewGameText } from "~/lib/home/HomeSetName";
import { useCheckGame } from "~/lib/game/useGameActions";

type FormInputs = {
  gameId: string;
};

export const HomeJoinGame = () => {
  const router = useRouter();
  const { checkGame, isLoading } = useCheckGame();
  const { register, handleSubmit } = useForm<FormInputs>();

  const gameId = router.query.gameId?.toString() || "";

  // Joining an existing game:
  const onSubmit = async ({ gameId }: FormInputs) => {
    await checkGame(gameId);
  };

  return (
    <div className="flex flex-col justify-between h-full">
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
        open={router.query.join ? true : false}
        title="What should we call you?"
        onClose={() => {
          router.replace({
            pathname: "/",
            query: { gameId },
          });
        }}
        maxWidth={400}
        closeButton
      >
        <HomeSetName />
      </Modal>
    </div>
  );
};
