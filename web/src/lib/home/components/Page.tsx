import styled from "styled-components";
import { theme } from "~/styles/theme";

enum Size {
  large = "large",
  full = "full",
}

type Props = {
  size?: keyof typeof Size;
  justify?: "start" | "center" | "end" | "stretch";
};

const renderSize = ({ size }: Props) => {
  if (size === Size.large) return "900px";
  if (size === Size.full) return "100%";
  return "600px";
};

export const PageContainer = styled.section<Props>`
  display: flex;
  padding: ${theme.spacings(4)};
  margin: 0 auto;
  flex-direction: column;
  justify-content: ${({ justify }) => (justify ? justify : "center")};
  align-items: center;
  height: calc(100vh - 50px);
  max-width: ${renderSize};
`;
