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
    id: "accounts",
    href: "/admin/accounts",
    label: "Accounts",
  },
];

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-dvh">
      <Sidebar homeLink="/dashboard" pageLinks={pageLinks} />
      {children}
    </div>
  );
};

export default Layout;
