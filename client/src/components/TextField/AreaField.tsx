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
  id?: HTMLTextAreaElement["id"];
  type?: HTMLTextAreaElement["type"];
  placeholder?: HTMLTextAreaElement["placeholder"];
  labelText?: ReactNode;
  children?: ReactNode;
  error?: boolean;
  errorText?: ReactNode;
};

export const AreaField = forwardRef<HTMLTextAreaElement, Props>(
  ({ id, labelText, placeholder, error, errorText, ...rest }, ref) => {
    return (
      <Field>
        <label htmlFor={id}>{labelText}</label>
        <Textarea
          id={id}
          placeholder={placeholder}
          ref={ref}
          as="textarea"
          {...rest}
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
