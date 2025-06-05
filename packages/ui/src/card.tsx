import * as React from "react";
import { cn } from "@repo/ui/utils";

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-card flex flex-col gap-5 overflow-hidden rounded-xl p-5 shadow-sm",
      className,
    )}
    {...props}
  />
);
