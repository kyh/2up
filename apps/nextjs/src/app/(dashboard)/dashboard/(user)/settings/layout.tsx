// export const runtime = "edge";

import { PageHeader } from "@/components/header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Profile</PageHeader>
      {children}
    </main>
  );
};

export default Layout;
