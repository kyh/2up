import { AuthLayout } from "~/lib/auth/AuthLayout";
import { getSupabaseServerClient } from "~/utils/supabase";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(`/`);
  }

  return <AuthLayout bgImage="crown">{children}</AuthLayout>;
}
