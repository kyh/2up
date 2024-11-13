import { api, HydrateClient } from "@/trpc/server";
import { Sidebar } from "./_components/sidebar";

export const dynamic = "force-dynamic";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  void api.auth.workspace.prefetch();

  return (
    <HydrateClient>
      <div className="flex min-h-dvh">
        <Sidebar />
        {props.children}
      </div>
    </HydrateClient>
  );
};

export default Layout;
