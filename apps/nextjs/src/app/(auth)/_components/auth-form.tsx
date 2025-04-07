"use client";

import { useParams, useRouter } from "next/navigation";
import { signInWithPasswordInput } from "@kyh/api/auth/auth-schema";
import { Button } from "@kyh/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@kyh/ui/form";
import { Input } from "@kyh/ui/input";
import { toast } from "@kyh/ui/toast";
import { cn } from "@kyh/ui/utils";
import { useMutation } from "@tanstack/react-query";

import type { SignInWithPasswordInput } from "@kyh/api/auth/auth-schema";
import { useTRPC } from "@/trpc/react";

type AuthFormProps = {
  type: "signin" | "signup";
} & React.HTMLAttributes<HTMLDivElement>;

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const params = useParams<{ nextPath?: string }>();

  const signInWithOAuth = useMutation(
    trpc.auth.signInWithOAuth.mutationOptions({
      onSuccess: ({ url }) => {
        router.replace(url);
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const signInWithPassword = useMutation(
    trpc.auth.signInWithPassword.mutationOptions({
      onSuccess: () => {
        router.replace(params.nextPath ?? `/`);
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const signUp = useMutation(
    trpc.auth.signUp.mutationOptions({
      onSuccess: () => {
        router.replace(params.nextPath ?? `/`);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm({
    schema: signInWithPasswordInput,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthWithGithub = () => {
    toast.error(
      "We're still in closed beta, so signing up is not available yet",
    );
    return;
    // signInWithOAuth.mutate({
    //   provider: "github",
    // });
  };

  const handleAuthWithPassword = (credentials: SignInWithPasswordInput) => {
    if (type === "signup") {
      toast.error(
        "We're still in closed beta, so signing up is not available yet",
      );
      return;
      // signUp.mutate(credentials);
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
        onClick={handleAuthWithGithub}
      >
        Continue with Github
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or</span>
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
