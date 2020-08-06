import React from "react";
import styled from "styled-components";
import { Input } from "../Input/Input";

export const Field = styled.fieldset`
  .error {
    color: ${({ theme }) => theme.colors.red};
  }
`;

type Props = {
  id?: HTMLTextAreaElement["id"];
  type?: HTMLTextAreaElement["type"];
  name?: HTMLTextAreaElement["name"];
  placeholder?: HTMLTextAreaElement["placeholder"];
  labelText?: React.ReactNode;
  children?: React.ReactNode;
  error?: boolean;
  errorText?: React.ReactNode;
};

export const AreaField = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ id, labelText, name, placeholder, error, errorText }, ref) => {
    return (
      <Field>
        <label htmlFor={id}>{labelText}</label>
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          ref={ref}
          as="textarea"
        />
        {error && <div className="error">{errorText}</div>}
      </Field>
    );
  }
);

const Textarea = styled(Input)`
  resize: vertical;
  min-height: 150px;
`;
