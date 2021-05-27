import styled from "styled-components";
import { theme } from "styles/theme";
import { visible } from "styles/animations";

const AlertTemplate = styled.div`
  color: ${theme.ui.alertText};
  background: ${theme.ui.alertBackground};
  padding: ${theme.spacings(3)};
  border-radius: ${theme.ui.borderWavyRadius};
  display: flex;
  align-items: flex-start;
  animation: ${visible} 0s linear 0.1s forwards;
  visibility: hidden;
`;

export const Alert = styled(AlertTemplate)`
  position: absolute;
  top: ${theme.spacings(3)};
`;

export const ReactAlertTemplate = ({ style, message, close }: any) => {
  return (
    <AlertTemplate style={style}>
      {message}
      <CloseButton onClick={close}>X</CloseButton>
    </AlertTemplate>
  );
};

const CloseButton = styled.button`
  margin-left: ${theme.spacings(3)};
`;
