"use client";

import { useRouter } from "next/navigation";
import { Button } from "@init/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import { api } from "@/trpc/react";

export function BillingPortalCard(props: { customerId: string }) {
  const router = useRouter();
  const createBillingPortalSession =
    api.billing.createBillingPortalSession.useMutation();

  return (
    <div>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
        <div>
          <h2 className="text-base font-light leading-7 text-primary">
            Manage your Billing Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Visit your Billing Portal to manage your subscription and billing.
            You can update or cancel your plan, or download your invoices.
          </p>
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={() => {
              createBillingPortalSession
                .mutateAsync({
                  returnUrl: getBillingPortalReturnUrl(),
                  customerId: props.customerId,
                })
                .then((url) => {
                  router.push(url);
                });
            }}
          >
            <span>Visit Billing Portal</span>

            <ArrowTopRightIcon className={"h-4"} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getBillingPortalReturnUrl() {
  return new URL(
    "/account/billing/return",
    process.env.NEXT_PUBLIC_SITE_URL,
  ).toString();
}
