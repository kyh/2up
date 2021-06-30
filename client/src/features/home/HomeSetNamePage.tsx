import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "util/redux";
import { playhouseActions } from "features/home/playhouseSlice";
import { Button, Input } from "components";
import { Form } from "features/home/components/Form";
import { StartNewGameText } from "./HomeJoinGamePage";

type FormInputs = {
  name: string;
};

export const HomeSetNamePage = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const storedName = useAppSelector((state) => state.playhouse.name);
  const gameId = useAppSelector((state) => state.game.gameId);
  const { register, handleSubmit } = useForm<FormInputs>();

  const onSubmit = ({ name }: FormInputs) => {
    dispatch(playhouseActions.update_user({ name }));
    if (gameId) {
      history.push(`/game/${gameId}/lobby`);
    } else {
      history.push(`/`);
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
        Or <Link to={`/game/${gameId}/lobby/spectate`}>spectate this game</Link>
      </StartNewGameText>
    </>
  );
};
