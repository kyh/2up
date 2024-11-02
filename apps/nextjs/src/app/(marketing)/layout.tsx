import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = async (props: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;
