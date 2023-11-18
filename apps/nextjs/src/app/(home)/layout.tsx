import { AuthShowcase } from "./_components/auth";

const Layout = (props: { children: React.ReactNode }) => (
  <section className="mx-auto max-w-lg space-y-5 py-8">
    <AuthShowcase />
    {props.children}
  </section>
);

export default Layout;
