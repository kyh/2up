import Link from "next/link";
import { Logo } from "@init/ui/logo";

import type { CardProps } from "./_components/card";
import { Card } from "./_components/card";
import { ShootingStars } from "./_components/shooting-stars";
import { StarBackground } from "./_components/star-background";

const pluginData: CardProps[] = [
  {
    id: 1,
    name: "Flappy Bird",
    description: "Flap your bird by jumping (literally) through pipes",
    slug: "flappy-bird",
    type: "movement",
    plays: 1300,
  },
  {
    id: 2,
    name: "Pacman",
    slug: "pacman",
    description:
      "Navigate your way through mazes, eat (literally) pellets, and avoid ghosts",
    type: "movement",
    plays: 200,
  },
  // {
  //   id: 3,
  //   name: "Space Invaders",
  //   slug: "space-invaders",
  //   description: "Laser down alien invaders before they reach Earth, pew pew",
  //   type: "sound",
  //   plays: 0,
  // },
];

const Page = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 h-screen w-full">
        <StarBackground />
        <ShootingStars />
      </div>
      <main className="flex min-h-dvh flex-col">
        <header className="mx-auto max-w-3xl px-5 py-10">
          <Logo className="text-muted-foreground size-10 opacity-50" />
        </header>
        <section className="mx-auto grid max-w-3xl grid-cols-1 gap-10 px-5 py-10 md:grid-cols-2">
          {pluginData.map((data) => {
            return (
              <Link
                href={data.slug}
                key={data.id}
                className="flex justify-center"
              >
                <Card {...data} />
              </Link>
            );
          })}
        </section>
        <footer className="text-muted-foreground relative mt-auto overflow-hidden pt-20 pb-10 text-center text-sm font-medium tracking-[-0.2px]">
          made with vibes by{" "}
          <a
            className="text-white"
            href="https://x.com/kaiyuhsu"
            target="_blank"
          >
            @kaiyuhsu
          </a>
          <div className="pointer-events-none absolute bottom-0 h-[300px] w-full translate-y-full rounded-full bg-gradient-to-tr from-[rgba(47,0,255,0.2)] to-[rgba(255,0,0,1)] blur-[62px]" />
        </footer>
      </main>
    </>
  );
};

export default Page;
