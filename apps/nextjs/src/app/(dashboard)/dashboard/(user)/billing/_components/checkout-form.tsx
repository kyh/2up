"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getProductPlanPair } from "@init/api/billing/billing-util";
import { toast } from "@init/ui/toast";

import { billingConfig } from "@/config/billing.config";
import { api } from "@/trpc/react";
import { PlanPicker } from "./plan-picker";

const EmbeddedCheckout = dynamic(
  async () => {
    const { EmbeddedCheckout } = await import("./embedded-checkout");

    return {
      default: EmbeddedCheckout,
    };
  },
  {
    ssr: false,
  },
);

export const CheckoutForm = (props: {
  userId: string;
  userEmail?: string;
  customerId: string | undefined;
}) => {
  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined,
  );

  const createCheckoutSession = api.billing.createCheckoutSession.useMutation();

  const handleSubmit = async ({
    planId,
    productId,
  }: {
    planId: string;
    productId: string;
  }) => {
    try {
      // the return URL for the checkout session
      const returnUrl = getCheckoutSessionReturnUrl();

      const product = billingConfig.products.find(
        (item) => item.id === productId,
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const { plan } = getProductPlanPair(billingConfig, planId);

      const { checkoutToken } = await createCheckoutSession.mutateAsync({
        returnUrl,
        accountId: props.userId,
        customerEmail: props.userEmail,
        customerId: props.customerId,
        plan,
        variantQuantities: [],
        enableDiscountField: product.enableDiscountField,
      });

      setCheckoutToken(checkoutToken);
    } catch (error) {
      toast.error(
        "There was an error requesting checkout. Please try again later.",
      );
    }
  };

  // only allow trial if the user is not already a customer
  const canStartTrial = !props.customerId;

  // If the checkout token is set, render the embedded checkout component
  if (checkoutToken) {
    return (
      <EmbeddedCheckout
        checkoutToken={checkoutToken}
        onClose={() => setCheckoutToken(undefined)}
      />
    );
  }

  // Otherwise, render the plan picker component
  return (
    <div>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
        <div>
          <h2 className="text-base font-light leading-7 text-primary">
            Manage your Plan
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Below are the details of your current plan. You can change your plan
            or cancel your subscription at any time.
          </p>
        </div>
        <div className="md:col-span-2">
          <PlanPicker
            pending={createCheckoutSession.isPending}
            config={billingConfig}
            canStartTrial={canStartTrial}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

const getCheckoutSessionReturnUrl = () => {
  return new URL(
    "/account/billing/return",
    process.env.NEXT_PUBLIC_SITE_URL,
  ).toString();
};
