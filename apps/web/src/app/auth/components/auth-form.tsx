"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Card } from "~/components";
import { useSupabase } from "~/components/providers/supabase-provider";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

type AuthFormProps = {
  isLogin?: boolean;
};

export const AuthForm = ({ isLogin }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async ({ email, password, username }: FormInputs) => {
    setLoading(true);

    try {
      if (!isLogin) {
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
      }
      router.push("/packs");
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        <Button className="mt-4" type="submit" fullWidth disabled={loading}>
          {isLogin ? "Login" : "Sign up"}
        </Button>
      </form>
    </Card>
  );
};
