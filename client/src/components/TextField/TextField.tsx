import { ReactNode, forwardRef } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import { Input } from "../Input/Input";

export const Field = styled.fieldset`
  .error {
    color: ${theme.colors.red};
  }
`;

type Props = {
  id?: HTMLInputElement["id"];
  type?: HTMLInputElement["type"];
  placeholder?: HTMLInputElement["placeholder"];
  labelText?: ReactNode;
  children?: ReactNode;
  error?: boolean;
  errorText?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, Props>(
  (
    { id, labelText, type = "text", placeholder, error, errorText, ...rest },
    ref
  ) => {
    return (
      <Field>
        <label htmlFor={id}>{labelText}</label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...rest}
        />
        {error && <div className="error">{errorText}</div>}
      </Field>
    );
  }
);
