import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "~/utils/trpc";
import { Link, Button, Input, useAlert, Modal } from "~/components";
import { Form } from "~/lib/home/components/Form";
import { HomeSetName, StartNewGameText } from "~/lib/home/HomeSetName";

type FormInputs = {
  gameId: string;
};

export const HomeJoinGame = () => {
  const alert = useAlert();
  const router = useRouter();
  const mutation = trpc.proxy.game.check.useMutation();
  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const gameId = router.query.gameId?.toString() || "";

  // Joining an existing game:
  const onSubmit = async ({ gameId }: FormInputs) => {
    await mutation.mutate(
      { gameId },
      {
        onSuccess: ({ id }) => {
          router.replace({
            pathname: "/",
            query: { gameId: id, join: true },
          });
        },
        onError: () => {
          alert.show("Game code does not exist");
          reset();
        },
      }
    );
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("gameId", { required: true })}
          type="tel"
          placeholder="Game Code"
          defaultValue={gameId}
        />
        <Button type="submit" disabled={mutation.isLoading}>
          Join existing game
        </Button>
      </Form>
      <StartNewGameText>
        Or <Link href="/packs">start your own game</Link>
      </StartNewGameText>
      <Modal
        open={router.query.join ? true : false}
        title="What should we call you?"
        onRequestClose={() => {
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
    </>
  );
};
