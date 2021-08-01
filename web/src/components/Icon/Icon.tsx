import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import { theme, colors } from "styles/theme";

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

type Props = StyledComponentProps<
  "div",
  DefaultTheme,
  {
    icon: IconType;
    color?: keyof typeof colors;
    size?: IconSizeType;
    rotate?: string;
  },
  never
>;

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

export const Icon = ({ icon, color, size, rotate, ...rest }: Props) => {
  const IconSvg = iconMap[icon];
  if (!IconSvg) return null;
  return (
    <StyledIcon
      className="playhouse-icon"
      iconColor={color}
      iconSize={size}
      rotate={rotate}
      {...rest}
    >
      <IconSvg />
    </StyledIcon>
  );
};

type StyledProps = {
  iconColor?: keyof typeof colors;
  iconSize?: IconSizeType;
  rotate?: string;
};

const iconSizeMap = {
  xs: "12px",
  sm: "16px",
  md: "24px",
  lg: "40px",
};

const getDimensions = (iconSize: IconSizeType) => {
  if (typeof iconSize === "number") return `${iconSize}px`;
  return iconSizeMap[iconSize];
};

const getSvgStyles = (props: StyledProps) => {
  const { iconSize, iconColor, rotate } = props;

  return css`
    width: ${iconSize ? getDimensions(iconSize) : "initial"};
    height: ${iconSize ? getDimensions(iconSize) : "initial"};
    transform: rotate(${rotate || 0});
    transition: fill 0.23s ease;
    path {
      fill: ${iconColor ? theme.colors[iconColor] : "currentColor"};
    }
  `;
};

const StyledIcon = styled.div<StyledProps>`
  display: inline-flex;
  padding: ${theme.spacings(1)};

  > svg {
    ${getSvgStyles}
  }
`;
