import React from "react";
import styled from "styled-components";
import { Input } from "../Input/Input";

export const Field = styled.fieldset`
  .error {
    color: ${({ theme }) => theme.colors.red};
  }
`;

type Props = {
  id?: HTMLInputElement["id"];
  type?: HTMLInputElement["type"];
  name?: HTMLInputElement["name"];
  placeholder?: HTMLInputElement["placeholder"];
  labelText?: React.ReactNode;
  children?: React.ReactNode;
  error?: boolean;
  errorText?: React.ReactNode;
};

export const TextField = React.forwardRef<HTMLInputElement, Props>(
  (
    { id, labelText, type = "text", name, placeholder, error, errorText },
    ref
  ) => {
    return (
      <Field>
        <label htmlFor={id}>{labelText}</label>
        <Input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
        />
        {error && <div className="error">{errorText}</div>}
      </Field>
    );
  }
);
