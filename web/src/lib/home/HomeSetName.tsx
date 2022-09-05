import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "~/utils/redux";
import { playhouseActions } from "~/lib/home/playhouseSlice";
import { Link, Button, Input } from "~/components";
import { Form } from "~/lib/home/components/Form";
import { StartNewGameText } from "~/lib/home/HomeJoinGame";
import { location } from "~/utils/window";

type FormInputs = {
  name: string;
};

export const HomeSetName = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storedName = useAppSelector((state) => state.playhouse.name);
  const gameId = useAppSelector((state) => state.game.gameId);
  const { register, handleSubmit } = useForm<FormInputs>();

  const onSubmit = ({ name }: FormInputs) => {
    dispatch(playhouseActions.update_user({ name }));
    if (gameId) {
      router.push(`/game/${gameId}/lobby${location.search}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name", { required: true })}
          placeholder="Username"
          defaultValue={storedName}
          autoFocus
        />
        <Button type="submit">Join Game</Button>
      </Form>
      <StartNewGameText>
        Or{" "}
        <Link to={`/game/${gameId}/spectate/lobby${location.search}`}>
          spectate this game
        </Link>
      </StartNewGameText>
    </>
  );
};
