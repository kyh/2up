import { MultiFactorAuthForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = async () => {
  return {
    title: "Verify Authentication",
  };
};

const VerifyPage = async () => {
  return <MultiFactorAuthForm />;
};

export default VerifyPage;
