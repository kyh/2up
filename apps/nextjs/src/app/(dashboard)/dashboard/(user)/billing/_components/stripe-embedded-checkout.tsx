"use client";

import { useState } from "react";
import { stripeClientEnvSchema } from "@init/api/billing/stripe/stripe-schema";
import { Dialog, DialogContent } from "@init/ui/dialog";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const { publishableKey } = stripeClientEnvSchema.parse({
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});

const stripePromise = loadStripe(publishableKey);

export const StripeCheckout = ({
  checkoutToken,
  onClose,
}: React.PropsWithChildren<{
  checkoutToken: string;
  onClose?: () => void;
}>) => (
  <EmbeddedCheckoutPopup key={checkoutToken} onClose={onClose}>
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: checkoutToken }}
    >
      <EmbeddedCheckout className="EmbeddedCheckoutClassName" />
    </EmbeddedCheckoutProvider>
  </EmbeddedCheckoutPopup>
);

const EmbeddedCheckoutPopup = ({
  onClose,
  children,
}: React.PropsWithChildren<{
  onClose?: () => void;
}>) => {
  const [open, setOpen] = useState(true);
  const className = `bg-white p-4 max-h-[98vh] overflow-y-auto shadow-transparent border`;

  return (
    <Dialog
      defaultOpen
      open={open}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }

        setOpen(open);
      }}
    >
      <DialogContent
        className={className}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
