import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { UserNav } from "@/components/nav";
import { createRedirectUrl } from "@/lib/url";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Authenticated pages.",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const pathname = headers().get("x-pathname");
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  // Redirect to login page if the user is not authenticated
  if (!data.session) {
    return redirect(createRedirectUrl("/auth/login", pathname ?? "/"));
  }

  return (
    <main className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">App Template</h2>
          <p className="text-muted-foreground">
            Here&apos;s an example list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UserNav />
        </div>
      </div>
      {children}
    </main>
  );
};

export default Layout;
