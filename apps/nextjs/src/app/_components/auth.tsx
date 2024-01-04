import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { signOut } from "../auth/actions";

export const Auth = async () => {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return <Link href="/auth/login">Sign in</Link>;
  }

  return (
    <form action={signOut}>
      {user.data.user.email} <button>(Sign out)</button>
    </form>
  );
};
