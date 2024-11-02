import { Sidebar } from "./_components/sidebar";

export const metadata = {
  title: `Super Admin`,
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      {props.children}
    </div>
  );
};

export default Layout;
