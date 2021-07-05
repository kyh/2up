import { useState } from "react";
import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { theme } from "styles/theme";
import { PageContainer, TextField, Button, Card } from "components";
import { useAuth } from "util/AuthProvider";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

type Props = { isLogin?: boolean };

export const AuthPage = ({ isLogin }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async ({ username, email, password }: FormInputs) => {
    setIsLoading(true);
    if (isLogin && auth.signin) {
      await auth.signin(username, password);
    } else if (auth.signup) {
      await auth.signup(username, email, password);
    }
    setIsLoading(false);
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
              labelText={isLogin ? "Email/Username" : "Username"}
              placeholder="Lil Jon Snow"
              error={!!errors.username}
              errorText="This field is required"
            />
            {!isLogin && (
              <TextField
                labelText="Email"
                id="email"
                {...register("email", { required: true })}
                type="email"
                placeholder="creator@playhouse.gg"
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
              autoComplete="on"
            />
            <Button
              className="submit"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLogin ? "Login" : "Sign up"}
            </Button>
          </form>
        </Card>
      </FormContainer>
    </Page>
  );
};

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
