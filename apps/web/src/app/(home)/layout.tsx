import Image from "next/image";
import { Navigation } from "@/lib/game/components/navigation";
import { PageContainer } from "@/lib/home/components/page";
import { Card } from "@/components";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <section className="translate-y-[-70px]">
          <div className="mb-3 flex justify-center">
            <Image alt="2up" height="65" src="/logo/logomark.svg" width="60" />
          </div>
          <Card className="h-[260px]">{children}</Card>
        </section>
      </PageContainer>
    </>
  );
};

export default HomeLayout;
