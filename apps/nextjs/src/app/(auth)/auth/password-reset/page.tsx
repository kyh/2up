import Link from "next/link";

import { RequestPasswordResetForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = () => {
  return {
    title: "Password Reset",
  };
};

const PasswordResetPage = () => (
  <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-lg font-light">Reset your Password</h1>
    </div>
    <RequestPasswordResetForm />
    <p className="px-8 text-center text-sm text-muted-foreground">
      Back to{" "}
      <Link href="/auth/sign-in" className="underline">
        sign in
      </Link>
    </p>
  </div>
);

export default PasswordResetPage;
