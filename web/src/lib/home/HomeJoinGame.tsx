import styled from "styled-components";
import { useRouter } from "next/router";
import { gql, useMutation } from "~/utils/mock";
import { useForm } from "react-hook-form";
import { theme } from "~/styles/theme";
import { useAppDispatch, useAppSelector } from "~/utils/redux";
import { Link, Button, Input, useAlert } from "~/components";
import { gameActions } from "~/lib/game/gameSlice";
import { Form } from "~/lib/home/components/Form";

type FormInputs = {
  gameId: string;
};

export const HomeJoinGame = () => {
  const alert = useAlert();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storedGameId = useAppSelector((state) => state.game.gameId);
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const [gameCheck, { loading }] = useMutation(GAME_CHECK);
  const queryParams = router.query;

  // Joining an existing game:
  const onSubmit = async ({ gameId }: FormInputs) => {
    const { data } = await gameCheck({
      variables: { input: { code: gameId } },
    });

    if (data?.game?.isValid) {
      dispatch(gameActions.new_game({ gameId }));
      router.push("/game_name");
    } else {
      alert.show("Game code does not exist");
      reset();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("gameId", { required: true })}
          type="tel"
          placeholder="Game ID"
          defaultValue={storedGameId || queryParams.gameId || ""}
        />
        <Button type="submit" disabled={loading}>
          Join existing game
        </Button>
      </Form>
      <StartNewGameText>
        Or <Link to="/packs">start your own game</Link>
      </StartNewGameText>
    </>
  );
};

const GAME_CHECK = gql`
  mutation HomeJoinGamePageGameCheckMutation($input: GameInput!) {
    game(input: $input) {
      isValid
    }
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