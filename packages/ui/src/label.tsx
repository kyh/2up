import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@repo/ui/utils";
import { cva } from "class-variance-authority";
import { Label as LabelPrimitive } from "radix-ui";

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />
);
