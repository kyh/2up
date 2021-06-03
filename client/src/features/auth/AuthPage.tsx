import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";
import { theme } from "styles/theme";
import { PageContainer, TextField, Button, Card } from "components";

import { AuthPageUserCreateMutation } from "./__generated__/AuthPageUserCreateMutation";
import { AuthPageSessionCreateMutation } from "./__generated__/AuthPageSessionCreateMutation";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

type Props = { isLogin?: boolean };

export const AuthPage = ({ isLogin }: Props) => {
  const alert = useAlert();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [
    userCreate,
    { loading: userCreateLoading },
  ] = useMutation<AuthPageUserCreateMutation>(USER_CREATE);
  const [
    sessionCreate,
    { loading: sessionCreateLoading },
  ] = useMutation<AuthPageSessionCreateMutation>(SESSION_CREATE);

  const onSubmit = async ({ username, email, password }: FormInputs) => {
    try {
      const action = isLogin ? sessionCreate : userCreate;
      const responseKey = isLogin ? "sessionCreate" : "userCreate";

      const { data } = await action({
        variables: { input: { username, email, password } },
      });

      if (data) {
        const responseData = (data as unknown) as Record<
          "sessionCreate" | "userCreate",
          { token: string }
        >;
        const { token } = responseData[responseKey];
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        history.push(`/${username}`);
      }
    } catch (error) {
      alert.show(error.message);
    }
  };

  return (
    <Page isLogin={isLogin} size="full">
      <FormContainer>
        <h1 className="title">{isLogin ? "Login" : "Sign up"}</h1>
        <Card background>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="username"
              {...register("username", { required: true })}
              labelText="Username"
              placeholder="Lil Jon Snow"
              error={!!errors.username}
              errorText="Username is required"
            />
            {!isLogin && (
              <TextField
                labelText="Email"
                id="email"
                {...register("email", { required: true })}
                type="email"
                placeholder="player@playhouse.gg"
                error={!!errors.email}
                errorText="Email is required"
              />
            )}
            <TextField
              labelText="Password"
              id="password"
              {...register("password", { required: true })}
              type="password"
              placeholder="Super secret password"
              error={!!errors.password}
              errorText="Password is required"
            />
            <Button
              className="submit"
              type="submit"
              fullWidth
              disabled={userCreateLoading || sessionCreateLoading}
            >
              {isLogin ? "Login" : "Sign up"}
            </Button>
          </form>
        </Card>
      </FormContainer>
    </Page>
  );
};

const USER_CREATE = gql`
  mutation AuthPageUserCreateMutation($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`;

const SESSION_CREATE = gql`
  mutation AuthPageSessionCreateMutation($input: SessionCreateInput!) {
    sessionCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`;

const Page = styled(PageContainer)<{ isLogin?: boolean }>`
  align-items: center;
  height: 100vh;
  background: ${theme.ui.backgroundGrey};
  background-repeat: no-repeat;
  ${({ isLogin }) =>
    isLogin
      ? css`
          background-image: url("/illustrations/kitty-crown.svg");
          background-position: 23% 102%;
        `
      : css`
          background-image: url("/illustrations/kitty-glasses.svg");
          background-position: 78% 102%;
        `}
`;

const FormContainer = styled.section`
  transform: translateY(-70px);
  .title {
    text-align: center;
  }
  .submit {
    margin-top: ${theme.spacings(4)};
  }
`;
