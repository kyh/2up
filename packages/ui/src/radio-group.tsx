"use client";

import * as React from "react";
import { cn } from "@init/ui/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupItemLabel = (
  props: React.PropsWithChildren<{
    className?: string;
    selected?: boolean;
  }>,
) => {
  return (
    <label
      className={cn(
        props.className,
        "flex cursor-pointer rounded-md" +
          " items-center space-x-4 border border-input" +
          " transition-duration-500 p-4 text-sm transition-all focus-within:border-primary",
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
RadioGroupItemLabel.displayName = "RadioGroupItemLabel";

export { RadioGroup, RadioGroupItem, RadioGroupItemLabel };
