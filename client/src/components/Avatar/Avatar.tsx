import styled, {
  StyledComponentProps,
  DefaultTheme,
  css,
} from "styled-components";
import raw from "raw.macro";
import { Box } from "reflexbox";
import { hashCode } from "utils/stringUtils";
import { fabBorder } from "../Button/borders";

type Props = StyledComponentProps<
  typeof Box,
  DefaultTheme,
  {
    name: string;
    contain?: boolean;
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
};

export const Avatar = ({ name, contain = false, ...rest }: Props) => {
  const avatar = hashCode(name, 7);
  const svg = avatarMap[avatar as keyof typeof avatarMap];
  if (!svg) return null;
  return (
    <StyledIcon
      contain={contain}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  );
};

const StyledIcon = styled(Box)<{ contain: boolean }>`
  display: inline-flex;
  > svg path {
    fill: ${({ theme }) => theme.ui.text};
  }
  ${({ contain }) =>
    contain &&
    css`
      width: 70px;
      height: 70px;
      border-radius: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: ${({ theme }) => theme.spacings(1)};
      background-repeat: no-repeat;
      background-size: contain;
      background-image: ${({ theme }) =>
        `url("data:image/svg+xml,${fabBorder(theme.ui.button.border)}")`};

      > svg {
        width: 100%;
        height: 80%;
      }
    `}
`;
