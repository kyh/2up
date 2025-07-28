import type { CardProps } from "./card";

export const featuredGames: CardProps[] = [
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
  {
    id: 3,
    name: "Tetris",
    slug: "tetris",
    description: "block block block block block block block block",
    type: "wip",
    plays: 1000,
  },
  {
    id: 4,
    name: "Pong",
    slug: "pong",
    description: "pong pong pong pong pong pong pong pong",
    type: "wip",
    plays: 1000,
  },
];
