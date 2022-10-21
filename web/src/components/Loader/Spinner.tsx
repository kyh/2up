import styled, { keyframes } from "styled-components";
import { theme } from "~/styles/theme";

const animate = keyframes`
  from { background-position: 40px 0; }
  to   { background-position: 0 0; }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
`;

const SpinnerStyles = styled.div`
  width: 140px;
  height: 30px;
  border: 4px ${theme.ui.borderColor} solid;
  border-radius: ${theme.ui.borderWavyRadius};
  background-image: linear-gradient(
    45deg,
    ${theme.ui.borderColor} 25%,
    transparent 25%,
    transparent 50%,
    ${theme.ui.borderColor} 50%,
    ${theme.ui.borderColor} 75%,
    transparent 75%,
    transparent
  );
  background-size: 40px 40px;
  animation: ${animate} 2s linear infinite;
`;

const SpinnerText = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacings(2)};
`;

type Props = {
  center?: boolean;
};

export const Spinner = (props: Props) => {
  return (
    <Container {...props}>
      <div>
        <SpinnerText>Loading...</SpinnerText>
        <SpinnerStyles role="spinner" />
      </div>
    </Container>
  );
};
