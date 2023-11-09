import { classed, deriveClassed, ComponentProps } from "@/lib/utils/classed";
import { hashCode } from "@/lib/utils/string";

import svg0 from "./svgs/0.svg";
import svg1 from "./svgs/1.svg";
import svg2 from "./svgs/2.svg";
import svg3 from "./svgs/3.svg";
import svg4 from "./svgs/4.svg";
import svg5 from "./svgs/5.svg";
import svg6 from "./svgs/6.svg";
import svg7 from "./svgs/7.svg";
import svg8 from "./svgs/8.svg";
import svg9 from "./svgs/9.svg";
import svg10 from "./svgs/10.svg";
import svg11 from "./svgs/11.svg";
import svg12 from "./svgs/12.svg";
import svg13 from "./svgs/13.svg";
import svg14 from "./svgs/14.svg";
import svg15 from "./svgs/15.svg";
import svg16 from "./svgs/16.svg";

const StyledIcon = classed.div(
  "flex justify-center items-end rounded-full overflow-hidden p-2 border-2 border-grey-dark dark:border-grey-light",
  {
    variants: {
      type: {
        default: "w-14 h-14",
        setName: "w-28 h-28 desktop:w-24 desktop:h-24 mb-2",
        full: "w-full h-full",
      },
    },
    defaultVariants: {
      type: "default",
    },
  },
);

type Props = ComponentProps<typeof StyledIcon> & {
  name: string;
};

export const avatarMap = {
  0: svg0,
  1: svg1,
  2: svg2,
  3: svg3,
  4: svg4,
  5: svg5,
  6: svg6,
  7: svg7,
  8: svg8,
  9: svg9,
  10: svg10,
  11: svg11,
  12: svg12,
  13: svg13,
  14: svg14,
  15: svg15,
  16: svg16,
};

const length = Object.keys(avatarMap).length;

export const Avatar = deriveClassed<typeof StyledIcon, Props>(
  ({ name, ...rest }, ref) => {
    const avatar = hashCode(name, length);
    const Svg = avatarMap[avatar as keyof typeof avatarMap];
    if (!Svg) return null;
    return (
      <StyledIcon {...rest} ref={ref}>
        <Svg className="h-4/5 w-full svg-path:fill-black dark:svg-path:fill-white desktop:h-full" />
      </StyledIcon>
    );
  },
);
