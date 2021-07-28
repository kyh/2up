import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { theme } from "styles/theme";
import { PageContainer } from "features/home/components/Page";

export const AuthLayout = ({
  children,
  bgImage,
}: {
  children: ReactNode;
  bgImage: "crown" | "glasses";
}) => {
  return (
    <Page size="full" bgImage={bgImage}>
      {children}
    </Page>
  );
};

const Page = styled(PageContainer)<{ bgImage: "crown" | "glasses" }>`
  align-items: center;
  height: 100vh;
  background: ${theme.ui.backgroundGrey};
  background-repeat: no-repeat;
  ${({ bgImage }) =>
    bgImage === "crown"
      ? css`
          background-image: url("/illustrations/kitty-crown.svg");
          background-position: 23% 102%;
        `
      : css`
          background-image: url("/illustrations/kitty-glasses.svg");
          background-position: 78% 102%;
        `}
`;
