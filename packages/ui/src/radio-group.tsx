"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

export const RadioGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
};

export const RadioGroupItem = ({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow-sm focus:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="fill-primary h-3.5 w-3.5" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
};

export const RadioGroupItemLabel = (
  props: React.PropsWithChildren<{
    className?: string;
    selected?: boolean;
  }>,
) => {
  return (
    <label
      className={cn(
        props.className,
        "flex rounded-md" +
          " border-border items-center space-x-4 border" +
          " transition-duration-500 focus-within:border-primary p-4 text-sm transition-all",
        {
          [`border-primary`]: props.selected,
          [`hover:border-primary`]: !props.selected,
        },
      )}
    >
      {props.children}
    </label>
  );
};
