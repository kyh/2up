import { Sidebar } from "@/components/sidebar";

export const metadata = {
  title: `Super Admin`,
};

const pageLinks = [
  {
    id: "home",
    href: "/admin",
    label: "Home",
    exact: true,
  },
  {
    id: "teams",
    href: "/admin/teams",
    label: "Teams",
  },
];

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <div className="flex min-h-dvh">
      <Sidebar homeLink="/dashboard" pageLinks={pageLinks} />
      {props.children}
    </div>
  );
};

export default Layout;
