import Link from "next/link";

import { AuthForm } from "@/app/(auth)/auth-form";

export const generateMetadata = async () => {
  return {
    title: "Sign Up",
  };
};

type Props = {
  searchParams: {
    invite_token?: string;
  };
};

const SignUpPage = ({ searchParams }: Props) => {
  const inviteToken = searchParams.invite_token;

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-lg font-light">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Please sign up to continue
        </p>
      </div>
      <AuthForm type="signup" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignUpPage;
