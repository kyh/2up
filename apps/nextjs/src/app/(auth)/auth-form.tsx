"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPasswordInput } from "@init/api/auth/auth-schema";
import { Button } from "@init/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";
import { cn } from "@init/ui/utils";

import type { SignInWithPasswordInput } from "@init/api/auth/auth-schema";
import { api } from "@/trpc/react";

type AuthFormProps = {
  type: "signin" | "signup";
} & React.HTMLAttributes<HTMLDivElement>;

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  const router = useRouter();
  const nextPath = useSearchParams().get("next") ?? "/home/dashboard";

  const signInWithOAuth = api.auth.signInWithOAuth.useMutation({
    onError: (error) => toast.error(error.message),
  });
  const signInWithPassword = api.auth.signInWithPassword.useMutation({
    onSuccess: () => router.replace(nextPath),
    onError: (error) => toast.error(error.message),
  });
  const signUp = api.auth.signUp.useMutation({
    onSuccess: () => router.replace(nextPath),
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: signInWithPasswordInput,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthWithPassword = (credentials: SignInWithPasswordInput) => {
    if (type === "signup") {
      signUp.mutate(credentials);
    }
    if (type === "signin") {
      signInWithPassword.mutate(credentials);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        loading={signInWithOAuth.isPending}
        onClick={() =>
          signInWithOAuth.mutate({
            provider: "github",
          })
        }
      >
        Continue with Github
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Form {...form}>
        <form
          className="grid gap-2"
          onSubmit={form.handleSubmit(handleAuthWithPassword)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-1 space-y-0">
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    data-test="email-input"
                    required
                    type="email"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-1 space-y-0">
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input
                    data-test="password-input"
                    required
                    type="password"
                    placeholder="******"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button loading={signUp.isPending || signInWithPassword.isPending}>
            {type === "signin" ? "Login" : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export const RequestPasswordResetForm = () => {
  return null;
};

export const UpdatePasswordForm = () => {
  return null;
};

export const MultiFactorAuthForm = () => {
  return null;
};
