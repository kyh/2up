import { React.ReactNode, ChangeEventHandler, forwardRef } from "react";
import { classed } from "@/lib/utils/classed";
import { Input } from "../input/input";

type Props = {
  id?: HTMLTextAreaElement["id"];
  type?: HTMLTextAreaElement["type"];
  placeholder?: HTMLTextAreaElement["placeholder"];
  labelText?: React.ReactNode;
  children?: React.ReactNode;
  error?: boolean;
  errorText?: React.ReactNode;
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value?: string;
};

export const AreaField = forwardRef<HTMLTextAreaElement, Props>(
  function AreaField(
    { id, labelText, placeholder, error, errorText, ...rest },
    ref
  ) {
    return (
      <fieldset>
        <label htmlFor={id}>{labelText}</label>
        <Textarea
          id={id}
          placeholder={placeholder}
          ref={ref as any}
          as="textarea"
          {...rest}
        />
        {error && <div className="text-red">{errorText}</div>}
      </fieldset>
    );
  }
);

const Textarea = classed.textarea(
  Input,
  "resize-y min-h-[150px] leading-[1.6rem] py-3 px-4"
);
