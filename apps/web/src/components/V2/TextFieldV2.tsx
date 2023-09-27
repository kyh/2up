import { ReactNode, forwardRef } from "react";
import { Input } from "../Input/Input";

type Props = {
  id?: HTMLInputElement["id"];
  type?: HTMLInputElement["type"];
  placeholder?: HTMLInputElement["placeholder"];
  autoComplete?: HTMLInputElement["autocomplete"];
  labelText?: ReactNode;
  children?: ReactNode;
  error?: boolean;
  errorText?: ReactNode;
  fullWidth?: boolean;
  defaultValue?: string;
  className?: string;
};

export const TextFieldV2 = forwardRef<HTMLInputElement, Props>(
  function TextField(
    {
      id,
      labelText,
      className,
      type = "text",
      placeholder,
      error,
      errorText,
      ...rest
    },
    ref
  ) {
    return (
      <fieldset>
        <input
          placeholder={placeholder}
          type={type}
          className={`${className} bg-grey-300 p-2 rounded-md w-64 h-8`}
          id={id}
          ref={ref}
          {...rest}
        ></input>
        {error && <div className="text-red">{errorText}</div>}
      </fieldset>
    );
  }
);
