// export const runtime = "edge";

import { PageHeader } from "@/components/header";
import { NavLink } from "@/components/nav";

const navLinks = [
  {
    title: "Account",
    href: "/account",
  },
  {
    title: "Billing",
    href: "/account/billing",
  },
];

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Profile</PageHeader>
      <nav className="inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0 text-muted-foreground">
        {navLinks.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pb-3 pt-2 text-sm font-light text-muted-foreground shadow-none ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background"
            activeClassName="border-b-primary text-foreground shadow-none"
            exact
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      {children}
    </main>
  );
};

export default Layout;
