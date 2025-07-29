import Link from "next/link";

import { Background } from "@/app/(home)/_components/background";
import { Card } from "@/app/(home)/_components/card";
import { PlayViewFooter } from "@/app/(home)/_components/composer";
import { featuredGames } from "@/app/(home)/_components/data";

const Page = () => {
  return (
    <>
      <Background />
      <main className="flex min-h-dvh flex-col">
        <section className="mx-auto grid max-w-3xl grid-cols-1 gap-10 px-5 pt-30 pb-10 md:grid-cols-2">
          {featuredGames.map((data) => {
            return (
              <Link
                key={data.id}
                href={`https://${data.slug}.vibedgames.com`}
                className="flex justify-center"
              >
                <Card {...data} />
              </Link>
            );
          })}
        </section>
        <PlayViewFooter />
      </main>
    </>
  );
};

export default Page;
