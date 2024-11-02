import { Sidebar } from "@/components/sidebar";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ team: string }>;
};

const Layout = async (props: LayoutProps) => {
  const params = await props.params;
  const teamSlug = params.team;
  const rootUrl = `/dashboard/${teamSlug}`;
  const pageLinks = [
    {
      id: "home",
      href: rootUrl,
      label: "Home",
      exact: true,
    },
    {
      id: "members",
      href: `${rootUrl}/members`,
      label: "Members",
    },
    {
      id: "settings",
      href: `${rootUrl}/settings`,
      label: "Settings",
    },
    {
      id: "billing",
      href: `${rootUrl}/billing`,
      label: "Billing",
    },
  ];

  console.log("teamSlug", teamSlug);

  return (
    <div className="flex min-h-dvh">
      <Sidebar homeLink="/dashboard" pageLinks={pageLinks} />
      {props.children}
    </div>
  );
};

export default Layout;
