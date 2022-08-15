import { theme } from "styles/theme";
import styled from "styled-components";

export const Carousel = styled.div`
  overflow: auto;
  display: flex;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  gap: ${theme.spacings(5)};

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    width: 20rem;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    animation: none !important;
  }

  & > *:active,
  & > *:hover {
    animation: none !important;
  }
`;
