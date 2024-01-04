import { AuthForm } from "@/app/auth/auth-form";

// export const runtime = "edge";

const Page = async () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
      </div>
      <AuthForm type="signin" />
    </div>
  );
};

export default Page;
