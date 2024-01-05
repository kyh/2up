"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

import { signInWithDiscord, signInWithPassword, signUp } from "./actions";

type AuthFormProps = {
  type: "signup" | "signin";
} & React.HTMLAttributes<HTMLDivElement>;

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="******"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          {type === "signin" && (
            <Button
              disabled={isLoading}
              formAction={async (formData) => {
                setIsLoading(true);

                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                const res = await signInWithPassword(email, password);

                router.push("/");
              }}
            >
              Login
            </Button>
          )}
          {type === "signup" && (
            <Button
              disabled={isLoading}
              formAction={async (formData) => {
                setIsLoading(true);

                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                const res = await signUp(email, password);

                router.push("/");
              }}
            >
              Sign Up
            </Button>
          )}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => signInWithDiscord()}
      >
        Discord
      </Button>
    </div>
  );
};
