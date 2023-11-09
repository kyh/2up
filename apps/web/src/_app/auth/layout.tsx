import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/utils/supabase";
import { PageContainer } from "@/lib/home/components/page";

export const dynamic = "force-dynamic";

type LayoutProps = {
  children: React.ReactNode;
};

export default async ({ children }: LayoutProps) => {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(`/`);
  }

  return (
    <section className="min-h-screen dark:bg-grey-dark">
      <PageContainer>{children}</PageContainer>
    </section>
  );
};
