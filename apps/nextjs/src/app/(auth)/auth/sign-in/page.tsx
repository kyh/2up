import Link from "next/link";

import { AuthForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = () => {
  return {
    title: "Sign In",
  };
};

type PageProps = {
  searchParams: Promise<{
    nextPath?: string;
    invite_token?: string;
  }>;
};

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col text-center">
        <h1 className="text-lg font-light">Welcome back</h1>
      </div>
      <AuthForm type="signin" nextPath={searchParams.nextPath} />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Page;
