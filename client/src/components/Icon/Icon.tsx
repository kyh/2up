import React from "react";
import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import raw from "raw.macro";

type Props = StyledComponentProps<
  "div",
  DefaultTheme,
  {
    icon: IconType;
    color?: keyof DefaultTheme["colors"];
    size?: IconSizeType;
    rotate?: string;
  },
  never
>;

export const iconMap = {
  setting: raw("./svgs/setting.svg"),
  close: raw("./svgs/close.svg"),
};

export type IconType = keyof typeof iconMap;
export type IconSizeType = "xs" | "sm" | "md" | "lg" | number;

export const Icon: React.FC<Props> = ({ icon, color, size, rotate }) => {
  const iconSvg = iconMap[icon];
  if (!iconSvg) return null;
  return (
    <StyledIcon
      className="playhouse-icon"
      iconColor={color}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
      iconSize={size}
      rotate={rotate}
    />
  );
};

type StyledProps = {
  iconColor?: keyof DefaultTheme["colors"];
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
    height: ${iconSize ? getDimensions(iconSize) : "intial"};
    path {
      fill: ${({ theme }) =>
        iconColor ? theme.colors[iconColor] : theme.ui.text};
    }
    transform: rotate(${rotate});
    transition: fill 0.23s ease;
  `;
};

const StyledIcon = styled.div<StyledProps>`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacings(1)};
  > svg {
    ${getSvgStyles}
  }
`;
