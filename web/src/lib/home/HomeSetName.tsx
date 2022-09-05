import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { theme } from "~/styles/theme";
import { Avatar, Link, Button, Input } from "~/components";
import { usePlayhouseStore } from "~/lib/home/playhouseStore";
import { useJoinGame } from "~/lib/game/useGameActions";
import { Form } from "~/lib/home/components/Form";

type FormInputs = {
  name: string;
};

export const HomeSetName = () => {
  const router = useRouter();
  const playerName = usePlayhouseStore((state) => state.playerName);
  const { joinGame } = useJoinGame();
  const { register, watch, handleSubmit } = useForm<FormInputs>();

  const gameId = router.query.gameId?.toString() || "0";
  const watchName = watch("name");

  const onSubmit = ({ name }: FormInputs) => {
    joinGame(gameId, name);
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
            pathname: `/game/${gameId}/spectate/lobby`,
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
