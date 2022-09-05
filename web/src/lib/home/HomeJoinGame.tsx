import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "~/utils/trpc";
import { Link, Button, Input, useAlert, Modal } from "~/components";
import { Form } from "~/lib/home/components/Form";
import { HomeSetName, StartNewGameText } from "~/lib/home/HomeSetName";

type FormInputs = {
  code: string;
};

export const HomeJoinGame = () => {
  const alert = useAlert();
  const router = useRouter();
  const mutation = trpc.proxy.game.check.useMutation();
  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const code = router.query.code?.toString() || "";

  // Joining an existing game:
  const onSubmit = async ({ code }: FormInputs) => {
    await mutation.mutate(
      { code },
      {
        onSuccess: ({ code }) => {
          router.replace({
            pathname: "/",
            query: { code, join: true },
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
          {...register("code", { required: true })}
          type="tel"
          placeholder="Game Code"
          defaultValue={code}
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
            query: { code },
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
