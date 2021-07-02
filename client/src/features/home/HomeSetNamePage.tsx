import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "util/redux";
import { playhouseActions } from "features/home/playhouseSlice";
import { Button, Input } from "components";
import { Form } from "features/home/components/Form";
import { StartNewGameText } from "./HomeJoinGamePage";

type FormInputs = {
  name: string;
};

export const HomeSetNamePage = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const storedName = useAppSelector((state) => state.playhouse.name);
  const gameId = useAppSelector((state) => state.game.gameId);
  const { register, handleSubmit } = useForm<FormInputs>();

  const onSubmit = ({ name }: FormInputs) => {
    dispatch(playhouseActions.update_user({ name }));
    if (gameId) {
      history.push({
        pathname: `/game/${gameId}/lobby`,
        search: location.search,
      });
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
        Or{" "}
        <Link
          to={{
            pathname: `/game/${gameId}/lobby/spectate`,
            search: location.search,
          }}
        >
          spectate this game
        </Link>
      </StartNewGameText>
    </>
  );
};
