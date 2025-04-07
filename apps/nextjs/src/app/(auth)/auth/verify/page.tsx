import type { Metadata } from "next";

import { MultiFactorAuthForm } from "@/app/(auth)/_components/auth-form";

export const metadata: Metadata = {
  title: "Verify Authentication",
};

const Page = () => {
  return <MultiFactorAuthForm />;
};

export default Page;
