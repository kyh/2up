import styled from "styled-components";
import { theme } from "~/styles/theme";

export const Card = styled.div<{ background?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacings(8)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: ${theme.ui.cardBorderUrl};
  background: ${({ background }) =>
    background ? theme.ui.background : "transparent"};
`;
