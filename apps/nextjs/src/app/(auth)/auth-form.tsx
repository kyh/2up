"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@init/ui/button";
import { Input } from "@init/ui/input";
import { Label } from "@init/ui/label";
import { toast } from "@init/ui/toast";
import { cn } from "@init/ui/utils";

import { signInWithGithub, signInWithPassword, signUp } from "./actions";

type AuthFormProps = {
  type: "signup" | "signin";
} & React.HTMLAttributes<HTMLDivElement>;

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitAuthForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (type === "signup") {
        await signUp(email, password);
      } else if (type === "signin") {
        await signInWithPassword(email, password);
      }
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => signInWithGithub()}
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
      <form onSubmit={submitAuthForm}>
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
          <Button loading={isLoading}>
            {type === "signin" ? "Login" : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
};
