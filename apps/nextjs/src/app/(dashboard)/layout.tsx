import { Sidebar } from "@/components/sidebar";

const pageLinks = [
  {
    id: "home",
    href: "/dashboard",
    label: "Home",
    exact: true,
  },
  {
    id: "billing",
    href: "/dashboard/billing",
    label: "Billing",
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    label: "Settings",
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
