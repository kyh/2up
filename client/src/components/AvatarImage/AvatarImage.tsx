import React from "react";
import styled, { StyledComponentProps, DefaultTheme } from "styled-components";
import raw from "raw.macro";

type Props = StyledComponentProps<
  "div",
  DefaultTheme,
  {
    avatar: number;
  },
  never
>;

export const avatarMap = {
  1: raw("./svgs/1.svg"),
  2: raw("./svgs/2.svg"),
  3: raw("./svgs/3.svg"),
  4: raw("./svgs/4.svg"),
  5: raw("./svgs/5.svg"),
  6: raw("./svgs/6.svg"),
  7: raw("./svgs/7.svg"),
  8: raw("./svgs/8.svg"),
  9: raw("./svgs/9.svg"),
  10: raw("./svgs/10.svg"),
};

export const AvatarImage: React.FC<Props> = ({ avatar }) => {
  const svg = avatarMap[avatar as 1];
  if (!svg) return null;
  return (
    <StyledIcon
      className="playhouse-avatar"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const StyledIcon = styled.div`
  display: inline-flex;
  > svg path {
    fill: ${({ theme }) => theme.ui.text};
  }
`;
