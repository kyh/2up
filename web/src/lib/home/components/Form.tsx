import styled from "styled-components";
import { theme } from "~/styles/theme";

export const Form = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;

  input {
    margin-bottom: ${theme.spacings(1)};
  }

  button {
    margin-bottom: ${theme.spacings(2)};
  }
`;
