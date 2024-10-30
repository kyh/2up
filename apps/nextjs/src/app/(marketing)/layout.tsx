import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
