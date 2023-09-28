import { classed } from "~/utils/classed";

export const Carousel = classed.div(
  "overflow-auto flex snap-mandatory snap-x scrollbar-none gap-5",
  "child:w-[20rem] child:snap-start child:snap-always child:shrink-0",
  "child:!animate-none child-hover:!animate-none child-active:!animate-none"
);
