import { classed, deriveClassed, ComponentProps } from "@tw-classed/react";

import setting from "./svgs/setting.svg";
import close from "./svgs/close.svg";
import pencil from "./svgs/pencil.svg";
import play from "./svgs/play.svg";
import trash from "./svgs/trash.svg";
import list from "./svgs/list.svg";
import share from "./svgs/share.svg";
import leftArrow from "./svgs/left-arrow.svg";
import rightArrow from "./svgs/right-arrow.svg";
import time from "./svgs/time.svg";
import question from "./svgs/question.svg";
import pause from "./svgs/pause.svg";
import rewind from "./svgs/rewind.svg";
import forward from "./svgs/forward.svg";
import previous from "./svgs/previous.svg";
import next from "./svgs/next.svg";
import loop from "./svgs/loop.svg";
import loopOff from "./svgs/loop-off.svg";
import volume from "./svgs/volume.svg";
import volumeMute from "./svgs/volume-mute.svg";

export const iconMap = {
  setting: setting,
  close: close,
  pencil: pencil,
  play: play,
  trash: trash,
  list: list,
  share: share,
  leftArrow: leftArrow,
  rightArrow: rightArrow,
  time: time,
  question: question,
  pause: pause,
  rewind: rewind,
  forward: forward,
  previous: previous,
  next: next,
  loop: loop,
  loopOff: loopOff,
  volume: volume,
  volumeMute: volumeMute,
};

type IconType = keyof typeof iconMap;
type IconSizeType = "xs" | "sm" | "md" | "lg" | number;

const iconSizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};
const getDimensions = (iconSize: IconSizeType) => {
  if (typeof iconSize === "number") return `w-[${iconSize}px] h-[${iconSize}px]`;
  return iconSizeMap[iconSize];
};

const StyledIcon = classed.div("inline-flex p-1");

type Props = ComponentProps<typeof StyledIcon> &
{
  icon: IconType;
  // The color is expected to be a tailwind color
  color?: string;
  size?: IconSizeType;
  rotate?: string;
};

export const Icon = deriveClassed<typeof StyledIcon, Props>(({ icon, color, size, rotate, ...rest }, ref) => {
  const IconSvg = iconMap[icon];
  if (!IconSvg) return null;

  const StyledSvg = classed(
    IconSvg,
    `rotate-[${rotate || 0}deg]`,
    `transition-[fill] duration-[0.23s] ease-[ease]`,
    `svg-path:fill-${color || "current"}`,
    `${size ? getDimensions(size) : "w-auto h-auto"}`
  );

  return (
    <StyledIcon {...rest} ref={ref}>
      <StyledSvg />
    </StyledIcon>
  );
});
