import { useEffect } from "react";
import { useRouter } from "next/router";
import { classed } from "~/utils/classed";
import { useForm } from "react-hook-form";
import { TextField, Button, Card } from "~/components";
import { useAuth } from "~/lib/auth/useAuth";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

type Props = { isLogin?: boolean };

export const AuthForm = ({ isLogin }: Props) => {
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
      {/* Title */}
      <h1 className="mb-5 text-center text-4xl font-bold">
        {isLogin ? "Login" : "Sign up"}
      </h1>
      <Card background>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <TextField
              id="username"
              {...register("username", { required: true })}
              labelText="Username"
              placeholder="Lil Jon Snow"
              error={!!errors.username}
              errorText="This field is required"
              fullWidth
            />
          )}
          <TextField
            labelText="Email"
            id="email"
            {...register("email", { required: true })}
            type="email"
            placeholder="creator@2uphq.com"
            error={!!errors.email}
            errorText="Email is required"
            fullWidth
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
            fullWidth
          />
          {/* Submit */}
          <Button
            className="mt-4"
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

const Container = classed.section("max-w-xs translate-y-[-70px]");
