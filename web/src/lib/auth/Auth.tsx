import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { theme } from "~/styles/theme";
import { TextField, Button, Card } from "~/components";
import { useAuth } from "~/lib/auth/useAuth";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

type Props = { isLogin?: boolean };

export const Auth = ({ isLogin }: Props) => {
  const router = useRouter();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    if (auth.user) {
      const { redirectTo } = router.query;
      router.push(redirectTo?.toString() || "/packs");
    }
  }, [auth.user, router]);

  const onSubmit = async ({ username, email, password }: FormInputs) => {
    if (isLogin) {
      auth.signIn({ email, password });
    } else {
      auth.signUp({ email, password, options: { data: { username } } });
    }
  };

  return (
    <Container>
      <h1 className="title">{isLogin ? "Login" : "Sign up"}</h1>
      <Card background>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <TextField
              id="username"
              {...register("username", { required: true })}
              labelText="Username"
              placeholder="Lil Jon Snow"
              error={!!errors.username}
              errorText="This field is required"
            />
          )}
          <TextField
            labelText="Email"
            id="email"
            {...register("email", { required: true })}
            type="email"
            placeholder="creator@playhouse.gg"
            error={!!errors.email}
            errorText="Email is required"
          />
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
            disabled={auth.loading}
          >
            {isLogin ? "Login" : "Sign up"}
          </Button>
        </form>
      </Card>
    </Container>
  );
};

const Container = styled.section`
  transform: translateY(-70px);

  .title {
    text-align: center;
  }

  .submit {
    margin-top: ${theme.spacings(4)};
  }
`;
