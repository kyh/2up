import styled from "styled-components";

type Props = {
  center?: boolean;
};

const Container = styled.div<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const Spinner = (props: Props) => {
  return <Container {...props}>Loading...</Container>;
};
