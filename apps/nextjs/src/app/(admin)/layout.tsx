import { HydrateClient } from "@/trpc/server";

export const metadata = {
  title: `Super Admin`,
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <HydrateClient>{children}</HydrateClient>
);

export default Layout;
