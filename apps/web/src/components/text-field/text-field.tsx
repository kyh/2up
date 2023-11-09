import { React.ReactNode, forwardRef } from "react";
import { Input } from "../input/input";

type Props = {
  id?: HTMLInputElement["id"];
  type?: HTMLInputElement["type"];
  placeholder?: HTMLInputElement["placeholder"];
  autoComplete?: HTMLInputElement["autocomplete"];
  labelText?: React.ReactNode;
  children?: React.ReactNode;
  error?: boolean;
  errorText?: React.ReactNode;
  fullWidth?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { id, labelText, type = "text", placeholder, error, errorText, ...rest },
  ref
) {
  return (
    <fieldset>
      <label htmlFor={id}>{labelText}</label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
      />
      {error && <div className="text-red">{errorText}</div>}
    </fieldset>
  );
});
