import { UserNav } from "@/components/nav";

const Layout = (props: { children: React.ReactNode }) => (
  <section className="mx-auto max-w-lg space-y-5 py-8">
    <UserNav />
    {props.children}
  </section>
);

export default Layout;
