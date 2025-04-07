import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/app/(auth)/_components/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const Page = () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col text-center">
        <h1 className="text-lg font-light">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Please sign up to continue
        </p>
      </div>
      <AuthForm type="signup" />
      <p className="text-muted-foreground px-8 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="#"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default Page;
