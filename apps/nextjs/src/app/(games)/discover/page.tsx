import Link from "next/link";

import type { CardProps } from "../_components/card";
import { Background } from "../_components/background";
import { Card } from "../_components/card";

const pluginData: CardProps[] = [
  {
    id: 1,
    name: "Flappy Bird",
    description:
      "flap flap flap flap flap flap flap flap flap flap flap flap flap",
    slug: "flappy-bird",
    type: "wip",
    plays: 1300,
  },
  {
    id: 2,
    name: "Pacman",
    slug: "pacman",
    description: "chomp chomp chomp chomp chomp chomp chomp",
    type: "wip",
    plays: 2000,
  },
];

const Page = () => {
  return (
    <>
      <Background />
      <main className="flex min-h-dvh flex-col">
        <section className="mx-auto grid max-w-3xl grid-cols-1 gap-10 px-5 pt-30 pb-10 md:grid-cols-2">
          {pluginData.map((data) => {
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
        <footer className="text-muted-foreground relative mt-auto overflow-hidden pt-20 pb-10 text-center text-sm font-medium tracking-[-0.2px]">
          made by{" "}
          <a
            className="text-white"
            href="https://x.com/kaiyuhsu"
            target="_blank"
          >
            kaiyu
          </a>
          <div className="pointer-events-none absolute bottom-0 h-[300px] w-full translate-y-full rounded-full bg-gradient-to-tr from-[rgba(47,0,255,0.2)] to-[rgba(255,0,0,1)] blur-[62px]" />
        </footer>
      </main>
    </>
  );
};

export default Page;
