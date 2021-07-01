import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import raw from "raw.macro";
import { theme, colors } from "styles/theme";

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
  setting: raw("./svgs/setting.svg"),
  close: raw("./svgs/close.svg"),
  pencil: raw("./svgs/pencil.svg"),
  play: raw("./svgs/play.svg"),
  trash: raw("./svgs/trash.svg"),
  list: raw("./svgs/list.svg"),
  share: raw("./svgs/share.svg"),
  leftArrow: raw("./svgs/left-arrow.svg"),
  rightArrow: raw("./svgs/right-arrow.svg"),
  time: raw("./svgs/time.svg"),
  question: raw("./svgs/question.svg"),
  pause: raw("./svgs/pause.svg"),
  rewind: raw("./svgs/rewind.svg"),
  forward: raw("./svgs/forward.svg"),
  previous: raw("./svgs/previous.svg"),
  next: raw("./svgs/next.svg"),
  loop: raw("./svgs/loop.svg"),
  loopOff: raw("./svgs/loop-off.svg"),
  volume: raw("./svgs/volume.svg"),
  volumeMute: raw("./svgs/volume-mute.svg"),
};

type IconType = keyof typeof iconMap;
type IconSizeType = "xs" | "sm" | "md" | "lg" | number;

export const Icon = ({ icon, color, size, rotate, ...rest }: Props) => {
  const iconSvg = iconMap[icon];
  if (!iconSvg) return null;
  return (
    <StyledIcon
      className="playhouse-icon"
      iconColor={color}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
      iconSize={size}
      rotate={rotate}
      {...rest}
    />
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
