import { classed, deriveClassed, ComponentProps } from "~/utils/classed";

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

const StyledIcon = classed.div(
  "inline-flex p-1 rounded-full",
  "child:transition-[fill] child:duration-[0.23s] child:ease-[ease]",
  {
    variants: {
      rotate: {
        default: "child:rotate-0",
        class: "",
      },
      fillColor: {
        default: "svg-path:fill-black dark:svg-path:fill-white",
        class: "",
      },
      size: {
        default: "child:w-auto child:h-auto",
        xs: "child:w-3 child:h-3",
        sm: "child:w-4 child:h-4",
        md: "child:w-6 child:h-6",
        lg: "child:w-10 child:h-10",
        class: "",
      },
    },
    defaultVariants: {
      rotate: "default",
      fillColor: "default",
      size: "default",
    },
  }
);

type Props = ComponentProps<typeof StyledIcon> & {
  icon: IconType;
};

export const Icon = deriveClassed<typeof StyledIcon, Props>(
  ({ icon, ...rest }, ref) => {
    const IconSvg = iconMap[icon];
    if (!IconSvg) return null;
    return (
      <StyledIcon {...rest} ref={ref}>
        <IconSvg />
      </StyledIcon>
    );
  }
);
