import { api } from "@/trpc/server";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await api.account.me();

  return (
    <>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
