import { ReactNode } from "react";
import { classed } from "@tw-classed/react"
import { Avatar, Button } from "~/components";

type PlayerProps = {
  playerName: string;
  playerContent?: ReactNode;
  children?: ReactNode;
};

export const Player = ({
  playerName,
  playerContent,
  children,
  ...rest
}: PlayerProps) => {
  return (
    <PlayerContainer className="player" {...rest}>
      <Avatar className="avatar" name={playerName} />
      <PlayerName className="name">
        {playerName}
        {playerContent}
      </PlayerName>
      {children}
    </PlayerContainer>
  );
};

const PlayerContainer = classed.div("relative flex flex-col items-center");

const PlayerName = classed.p("mt-1 mb-0");

export const PlayersGrid = classed.div(
  "grid gap-3 w-full",
  "desktop:absolute desktop:felx desktop:justify-between desktop:pointer-events-none",
  "desktop:bottom-0 desktop:right-5 desktop:left-5",
  // TODO- make sure these work
  "[&_.player]:desktop:text-center [&_.player]:desktop:self-end [&_.player]:desktop:flex-col-reverse",
  "[&_.player_.name]:desktop:mb-1",
  "[&_.player_.avatar]:desktop:p-0 [&_.player_.avatar]:desktop:overflow-hidden",
  "[&_.player_.avatar_svg]:desktop:max-w-[130px] [&_.player_.avatar_svg]:desktop:max-h-[300px]",
  "[&_.player_.correct]:desktop:top-auto [&_.player_.correct]:desktop:left-auto [&_.player_.correct]:desktop:bottom-[-7px]",
  // TODO- make sure this works
  "[&_.avatar_>_svg]:animate-[jitter_0.7s_linear_infinite]", {
  variants:{
    singleCol:{
      true:"grid-cols-1",
      false:"grid-cols-3"
    },
  },
  defaultVariants:{
    singleCol:"false"
  }
});

export const NextButton = classed(
  Button, "absolute bottom-10 left-1/2 w-[150px] ml-[-75px] z-10 desktop:bg-white desktop:dark:bg-black");
