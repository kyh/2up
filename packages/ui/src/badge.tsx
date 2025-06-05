import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@repo/ui/utils";
import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground",
        success: "bg-green-50 text-green-500 dark:bg-green-500/20",
        warning: "bg-orange-50 text-orange-500 dark:bg-orange-500/20",
        info: "bg-blue-50 text-blue-500 dark:bg-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
