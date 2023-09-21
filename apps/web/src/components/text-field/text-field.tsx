import { ReactNode, forwardRef } from "react";
import { Input } from "../input/input";

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
        ></input>
        {error && <div className="text-red">{errorText}</div>}
      </fieldset>
    );
  }
);
