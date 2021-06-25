import styled, { StyledComponentProps, DefaultTheme } from "styled-components";

type Props = StyledComponentProps<
  "div",
  DefaultTheme,
  {
    content: string;
  },
  never
>;

export const Svg = ({ content, ...rest }: Props) => {
  return (
    <StyledIcon
      className="playhouse-svg"
      dangerouslySetInnerHTML={{ __html: content }}
      {...rest}
    />
  );
};

const StyledIcon = styled.div`
  display: inline-flex;
  > svg {
    path {
      fill: currentColor;
    }
  }
`;
