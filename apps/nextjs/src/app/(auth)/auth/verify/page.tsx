import { MultiFactorAuthForm } from "@/app/(auth)/_components/auth-form";

export const generateMetadata = () => {
  return {
    title: "Verify Authentication",
  };
};

const VerifyPage = () => {
  return <MultiFactorAuthForm />;
};

export default VerifyPage;
