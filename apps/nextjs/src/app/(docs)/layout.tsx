import { Logo } from "@init/ui/logo";

import { NavLink } from "@/components/nav";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <section className="flex min-h-dvh">
    <Sidebar />
    <section className="flex-1 px-10 py-16">
      <main className="prose prose-zinc dark:prose-invert">{children}</main>
    </section>
  </section>
);

export default Layout;

const navLinks = {
  overview: {
    label: "Overview",
    children: [
      { id: "introduction", href: "/docs", label: "Introduction" },
      {
        id: "installation",
        href: "/docs/installation",
        label: "Getting Started",
      },
      {
        id: "local-development",
        href: "/docs/local-development",
        label: "Local Development",
      },
    ],
  },
  architecture: {
    label: "Architecture",
    children: [
      {
        id: "architecture",
        href: "/docs/architecture",
        label: "Architecture and Folder Structure",
      },
      { id: "auth", href: "/docs/auth", label: "Authentication" },
    ],
  },
  development: {
    label: "Build",
    children: [
      { id: "data-model", href: "/docs/data-model", label: "Data Modelling" },
      { id: "query", href: "/docs/queries", label: "Data Fetching" },
      { id: "mutations", href: "/docs/mutations", label: "Data Mutations" },
      { id: "production", href: "/docs/production", label: "Launch Checklist" },
      { id: "styling", href: "/docs/styling", label: "Styling" },
      { id: "routes", href: "/docs/routes", label: "Routes" },
    ],
  },
  launch: {
    label: "Launch",
    children: [
      { id: "deployment", href: "/docs/deployment", label: "Deployment" },
      { id: "monitoring", href: "/docs/monitoring", label: "Monitoring" },
    ],
  },
  scale: {
    label: "Scale",
    children: [
      {
        id: "user-analytics",
        href: "/docs/user-analytics",
        label: "User Analytics",
      },
      {
        id: "user-feedback",
        href: "/docs/user-feedback",
        label: "User Feedback",
      },
      {
        id: "performance",
        href: "/docs/performance",
        label: "App Performance",
      },
    ],
  },
  community: {
    label: "Community",
    children: [
      { id: "github", href: "https://github.com/kyh/init", label: "Github" },
      { id: "twitter", href: "https://twitter.com/kaiyuhsu", label: "Twitter" },
      {
        id: "discord",
        href: "https://discord.gg/x2xDwExFFv",
        label: "Discord",
      },
    ],
  },
} as const;

const navLinkEntries = Object.entries(navLinks);

const Sidebar = () => {
  return (
    <aside className="max-h-dvh w-64 overflow-y-auto border-r border-border">
      <div className="p-5">
        <NavLink href="/">
          <Logo className="size-10" />
        </NavLink>
      </div>
      <nav className="text-sm">
        <ul className="space-y-4">
          {navLinkEntries.map(([key, group]) => (
            <li key={key}>
              <h4 className="px-6 py-2 font-semibold">{group.label}</h4>
              <ul>
                {group.children?.map((link) => (
                  <li key={link.id}>
                    <NavLink
                      href={link.href}
                      className="block px-6 py-2"
                      activeClassName="bg-muted"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
