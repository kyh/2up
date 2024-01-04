import { signIn } from "@acme/auth";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

type AuthFormProps = {
  type: "signup" | "signin";
} & React.HTMLAttributes<HTMLDivElement>;

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              placeholder="******"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          {type === "signin" && (
            <Button
              formAction={async (formData) => {
                "use server";
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                console.log("login", { email, password });
              }}
            >
              Login
            </Button>
          )}
          {type === "signup" && (
            <Button
              formAction={async (formData) => {
                "use server";
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                console.log("signup", { email, password });
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
      <form>
        <Button
          className="w-full"
          variant="outline"
          formAction={async () => {
            "use server";
            await signIn("discord", {
              redirectTo: "/",
            });
          }}
        >
          Discord
        </Button>
      </form>
    </div>
  );
};
