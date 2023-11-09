import { Navigation } from "@/lib/packs/components/navigation";
import { Page } from "@/lib/packs/components/page";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page>
      <Navigation />
      {children}
    </Page>
  );
};

export default Layout;
