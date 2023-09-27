import { getSupabaseServerClient } from "~/utils/supabase";
import { redirect } from "next/navigation";
import { PageContainer } from "~/lib/home/components/Page";

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

  return <PageContainer>{children}</PageContainer>;
}
