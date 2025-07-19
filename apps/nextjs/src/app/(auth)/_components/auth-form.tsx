"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signInWithPasswordInput } from "@repo/api/auth/auth-schema";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { toast } from "@repo/ui/toast";
import { cn } from "@repo/ui/utils";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import type { SignInWithPasswordInput } from "@repo/api/auth/auth-schema";
import { useTRPC } from "@/trpc/react";

type AuthFormProps = {
  type: "login" | "register";
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
      onSuccess: ({ user }) => {
        router.replace(
          params.nextPath ?? `/dashboard/${user.user_metadata.defaultTeamSlug}`,
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const signUp = useMutation(
    trpc.auth.signUp.mutationOptions({
      onSuccess: ({ user }) => {
        router.replace(
          params.nextPath ?? `/dashboard/${user.user_metadata.defaultTeamSlug}`,
        );
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
    signInWithOAuth.mutate({
      provider: "github",
    });
  };

  const handleAuthWithPassword = (credentials: SignInWithPasswordInput) => {
    if (type === "register") {
      signUp.mutate(credentials);
    }
    if (type === "login") {
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
            {type === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export const RequestPasswordResetForm = () => {
  const trpc = useTRPC();
  const [isSuccess, setIsSuccess] = useState(false);

  const requestPasswordReset = useMutation(
    trpc.auth.requestPasswordReset.mutationOptions({
      onSuccess: () => {
        setIsSuccess(true);
        toast.success("Password reset email sent successfully!");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm({
    schema: z.object({
      email: z.string().email(),
    }),
    defaultValues: {
      email: "",
    },
  });

  const handlePasswordReset = (data: { email: string }) => {
    requestPasswordReset.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Password reset email sent! Check your inbox and follow the
            instructions to reset your password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handlePasswordReset)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-1 space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
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
        <Button loading={requestPasswordReset.isPending}>
          Request Password Reset
        </Button>
      </form>
    </Form>
  );
};

export const UpdatePasswordForm = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const updatePassword = useMutation(
    trpc.auth.updatePassword.mutationOptions({
      onSuccess: () => {
        toast.success("Password updated successfully!");
        router.push("/dashboard");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm({
    schema: z
      .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleUpdatePassword = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    updatePassword.mutate({ password: data.password });
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleUpdatePassword)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-1 space-y-0">
              <FormLabel className="sr-only">New Password</FormLabel>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder="Enter new password"
                  autoCapitalize="none"
                  autoComplete="new-password"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-1 space-y-0">
              <FormLabel className="sr-only">Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder="Confirm new password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={updatePassword.isPending}>Update Password</Button>
      </form>
    </Form>
  );
};

export const MultiFactorAuthForm = () => {
  return null;
};
