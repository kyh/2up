import { Composer } from "../_components/composer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <>
      {props.children}
      <Composer />
    </>
  );
};

export default Layout;
