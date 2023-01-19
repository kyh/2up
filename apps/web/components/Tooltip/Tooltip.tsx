import styled from "styled-components";
import { theme } from "styles/theme";
import { Float, FloatProps } from "@headlessui-float/react";
import { useState } from "react";

export const Tooltip = styled.div`
  color: ${theme.ui.alertText};
  background: ${theme.ui.alertBackground};
  padding: ${theme.spacings(3)};
  border-radius: ${theme.ui.borderWavyRadius};
  display: flex;
  align-items: flex-start;
`;

type Props = {
  children: React.ReactNode;
  tipContent: React.ReactNode;
} & Omit<FloatProps, "children">;

export const WithTip = ({ children, tipContent, ...props }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <Float
      offset={8}
      flip
      shift={6}
      portal
      enter="ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={show}
      {...props}
    >
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <Tooltip>{tipContent}</Tooltip>
    </Float>
  );
};
