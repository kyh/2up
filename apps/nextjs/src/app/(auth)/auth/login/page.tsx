import Link from "next/link";

import { AuthForm } from "@/app/(auth)/auth-form";

// export const runtime = "edge";

const Page = async () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-lg font-light">Welcome back</h1>
      </div>
      <AuthForm type="signin" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Page;
