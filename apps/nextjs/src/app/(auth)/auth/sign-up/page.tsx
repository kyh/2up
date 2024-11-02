import Link from "next/link";

import { AuthForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = () => {
  return {
    title: "Sign Up",
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
        <h1 className="text-lg font-light">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Please sign up to continue
        </p>
      </div>
      <AuthForm type="signup" nextPath={searchParams.nextPath} />
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

export default Page;
