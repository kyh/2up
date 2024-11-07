"use client";

import * as React from "react";
import { cn } from "@init/ui/utils";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { Button, buttonVariants } from "./button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

/**
 * We save the global alert dialog state outside of react so that we can follow the same api pattern
 * as `toasts` and call `alert.open` from anywhere in the app.
 */
type AlertState = {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: {
    hidden?: boolean;
    label?: React.ReactNode;
    onClick?: () => void | Promise<any>;
  };
  cancel?: {
    hidden?: boolean;
    label?: React.ReactNode;
    onClick?: () => void | Promise<any>;
  };
};

type Listener = () => void;

const alertDialogStore = {
  state: {
    open: false,
    title: "",
  } as AlertState,
  listeners: [] as Listener[],
  subscribe: (listener: Listener) => {
    alertDialogStore.listeners.push(listener);
    return () => {
      alertDialogStore.listeners = alertDialogStore.listeners.filter(
        (l) => l !== listener,
      );
    };
  },
  getSnapshot: () => {
    return alertDialogStore.state;
  },
  emitChange: () => {
    alertDialogStore.listeners.forEach((listener) => listener());
  },
};

const alertDialog = {
  open: (
    title: React.ReactNode,
    options: Omit<AlertState, "open" | "title">,
  ) => {
    alertDialogStore.state = {
      ...alertDialogStore.state,
      ...options,
      open: true,
      title,
    };
    alertDialogStore.emitChange();
  },
  close: () => {
    alertDialogStore.state = {
      ...alertDialogStore.state,
      open: false,
    };
    alertDialogStore.emitChange();
  },
};

const GlobalAlertDialog = () => {
  const [pendingAction, setPendingAction] = React.useState(false);
  const [pendingCancel, setPendingCancel] = React.useState(false);
  const alertState = React.useSyncExternalStore(
    alertDialogStore.subscribe,
    alertDialogStore.getSnapshot,
    alertDialogStore.getSnapshot,
  );

  const onOpenChange = (open: boolean) => {
    if (pendingAction || pendingCancel) return;
    if (!open) {
      setPendingCancel(true);
      const res = alertState.cancel?.onClick?.();
      if (res instanceof Promise) {
        void res.then(() => {
          setPendingCancel(false);
          alertDialog.close();
        });
      } else {
        setPendingCancel(false);
        alertDialog.close();
      }
    }
  };

  const onConfirm = () => {
    setPendingAction(true);
    const res = alertState.action?.onClick?.();
    if (res instanceof Promise) {
      void res.then(() => {
        setPendingAction(false);
        alertDialog.close();
      });
    } else {
      setPendingAction(false);
      alertDialog.close();
    }
  };

  return (
    <AlertDialog open={alertState.open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
        </AlertDialogHeader>
        {alertState.description && (
          <AlertDialogDescription>
            {alertState.description}
          </AlertDialogDescription>
        )}
        <AlertDialogFooter>
          {!alertState.action?.hidden && (
            <Button onClick={onConfirm} disabled={pendingAction}>
              {alertState.action?.label ?? "Confirm"}
            </Button>
          )}
          {!alertState.cancel?.hidden && (
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={pendingCancel}
            >
              {alertState.cancel?.label ?? "Close"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {
  alertDialog,
  GlobalAlertDialog,
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
