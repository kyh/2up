import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { theme } from "~/styles/theme";
import { Avatar, Link, Button, Input, useAlert } from "~/components";
import { useGameStore } from "~/lib/game/gameStore";
import { Form } from "~/lib/home/components/Form";
import { trpc } from "~/utils/trpc";

type FormInputs = {
  name: string;
};

export const HomeSetName = () => {
  const alert = useAlert();
  const router = useRouter();
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const mutation = trpc.proxy.game.join.useMutation();
  const { register, watch, handleSubmit } = useForm<FormInputs>();

  const code = router.query.code?.toString() || "0";
  const watchName = watch("name");

  const onSubmit = ({ name }: FormInputs) => {
    setPlayerName(name);
    mutation.mutate(
      {
        code,
        playerName: name,
      },
      {
        onSuccess: () => {
          router.push({
            pathname: `/game/${code}/lobby`,
            query: router.query,
          });
        },
        onError: () => {
          alert.show("Error joining game");
          router.push(`/`);
        },
      }
    );
  };

  return (
    <SectionBody>
      <Form className="set-name-form" onSubmit={handleSubmit(onSubmit)}>
        <Avatar
          className="set-name-avatar"
          name={watchName}
          expandOnDesktop={false}
        />
        <Input
          {...register("name", { required: true })}
          placeholder="Player Name"
          defaultValue={playerName}
          autoFocus
        />
        <Button type="submit">Lets go!</Button>
      </Form>
      <StartNewGameText>
        Or{" "}
        <Link
          href={{
            pathname: `/game/${code}/spectate/lobby`,
            query: router.query,
          }}
        >
          spectate this game
        </Link>
      </StartNewGameText>
    </SectionBody>
  );
};

const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 300px;

  .set-name-form {
    gap: ${theme.spacings(1)};
  }

  .set-name-avatar {
    width: 100px;
    height: 100px;
    margin-bottom: ${theme.spacings(2)};
  }
`;

export const StartNewGameText = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;

  a {
    margin-left: ${theme.spacings(1.2)};
    text-decoration: underline;
  }
`;
