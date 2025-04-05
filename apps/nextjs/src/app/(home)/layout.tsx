import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  prefetch(trpc.auth.workspace.queryOptions());

  return (
    <HydrateClient>
      <main className="h-dvh w-dvw overflow-hidden">{props.children}</main>
    </HydrateClient>
  );
};

export default Layout;
