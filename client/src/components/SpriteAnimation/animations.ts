import { keyframes } from "styled-components";

export const scaleIn = keyframes`
  0% {
      transform: scale(0);
  }
  90% {
    transform: scale(1.05);
  }
  95% {
    transform: scale(0.95);
  }
  100% {
      transform: scale(1.0);
  }
`;

export const visible = keyframes`
  to {
    visibility: visible;
  }
`;
