import styled, {
  css,
  StyledComponentProps,
  DefaultTheme,
} from "styled-components";
import { hashCode } from "~/utils/string";
import { theme } from "~/styles/theme";

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

type Props = StyledComponentProps<
  "div",
  DefaultTheme,
  {
    name: string;
    expandOnDesktop?: boolean;
  },
  never
>;

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

export const Avatar = ({ name, expandOnDesktop = true, ...rest }: Props) => {
  const avatar = hashCode(name, length);
  const Svg = avatarMap[avatar as keyof typeof avatarMap];
  if (!Svg) return null;
  return (
    <StyledIcon expandOnDesktop={expandOnDesktop} {...rest}>
      <Svg />
    </StyledIcon>
  );
};

const StyledIcon = styled.div<{ expandOnDesktop: boolean }>`
  display: flex;
  width: 70px;
  height: 70px;
  border-radius: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: flex-end;
  padding: ${theme.spacings(1)};
  background-repeat: no-repeat;
  background-size: contain;
  background-image: ${theme.ui.buttonFabBorderUrl};

  > svg {
    width: 100%;
    height: 80%;
    path {
      fill: ${theme.ui.text};
    }
  }

  ${theme.breakpoints.desktop} {
    ${({ expandOnDesktop }) =>
      expandOnDesktop &&
      css`
        display: inline-flex;
        width: auto;
        height: auto;
        border-radius: 0;
        overflow: hidden;
        background: none;
        overflow: auto;

        > svg {
          width: 100%;
          height: 100%;
        }
      `}
  }
`;
