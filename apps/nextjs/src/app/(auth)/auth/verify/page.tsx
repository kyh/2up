import { redirect } from "next/navigation";
import { checkRequiresMultiFactorAuthentication } from "@2up/api/auth/check-requires-mfa";
import { requireUser } from "@2up/api/auth/require-user";
import { getSupabaseServerClient } from "@2up/db/supabase-server-client";

import { MultiFactorAuthForm } from "@/app/(auth)/auth-form";

type Props = {
  searchParams: {
    next?: string;
  };
};

export const generateMetadata = async () => {
  return {
    title: "Verify Authentication",
  };
};

const VerifyPage = async (props: Props) => {
  const client = getSupabaseServerClient();
  const needsMfa = await checkRequiresMultiFactorAuthentication(client);

  if (!needsMfa) {
    redirect("/auth/sign-in");
  }

  const redirectPath = props.searchParams.next ?? "/dashboard";
  const auth = await requireUser(client);

  if (auth.error) {
    redirect(auth.redirectTo);
  }

  return <MultiFactorAuthForm />;
};

export default VerifyPage;
