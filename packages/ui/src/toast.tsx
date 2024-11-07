"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type GlobalToasterProps = React.ComponentProps<typeof Sonner>;

const GlobalToaster = ({ ...props }: GlobalToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as GlobalToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { GlobalToaster, toast };
