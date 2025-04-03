import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

export const labelVariants = cva(
  "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />
);
