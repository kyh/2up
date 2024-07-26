import { UpdatePasswordForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = async () => {
  return {
    title: "Password Update",
  };
};

const PasswordResetPage = () => (
  <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-lg font-light">Update your Password</h1>
    </div>
    <UpdatePasswordForm />
  </div>
);

export default PasswordResetPage;
