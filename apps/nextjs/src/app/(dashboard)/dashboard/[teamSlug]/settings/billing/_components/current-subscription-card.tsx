import { getProductPlanPairByVariantId } from "@init/api/billing/billing-util";
import { Alert, AlertDescription, AlertTitle } from "@init/ui/alert";
import { If } from "@init/ui/if";
import { formatDate } from "date-fns";
import { CircleCheckIcon } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import type { BillingConfig } from "@init/api/billing/billing-schema";
import { CurrentPlanAlert } from "./current-plan-alert";
import { CurrentPlanBadge } from "./current-plan-badge";
import { LineItemDetails } from "./line-item-details";

type Subscription = RouterOutputs["billing"]["getSubscription"];

type Props = {
  subscription: Subscription;

  config: BillingConfig;
};

export const CurrentSubscriptionCard = ({
  subscription,
  config,
}: React.PropsWithChildren<Props>) => {
  if (!subscription) {
    throw new Error("No subscription");
  }

  const lineItems = subscription.items;
  const firstLineItem = lineItems[0];

  if (!firstLineItem) {
    throw new Error("No line items found in subscription");
  }

  const { product, plan } = getProductPlanPairByVariantId(
    config,
    firstLineItem.variantId,
  );

  if (!product || !plan) {
    throw new Error(
      "Product or plan not found. Did you forget to add it to the billing config?",
    );
  }

  const productLineItems = plan.lineItems;

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
      <div>
        <h2 className="text-base font-light leading-7 text-primary">
          Your Plan
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Below are the details of your current plan. You can change your plan
          or cancel your subscription at any time.
        </p>
      </div>
      <div className="md:col-span-2">
        <div className="space-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <CircleCheckIcon className="s-6 fill-green-500 text-black dark:fill-white dark:text-white" />
              <span>{product.name}</span>
              <CurrentPlanBadge status={subscription.status} />
            </div>

            <div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>

          {/*
         Only show the alert if the subscription requires action
          (e.g. trial ending soon, subscription canceled, etc.)
        */}
          <If condition={!subscription.active}>
            <div>
              <CurrentPlanAlert status={subscription.status} />
            </div>
          </If>

          <If condition={subscription.status === "trialing"}>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">Your trial ends on</span>

              <div className="text-muted-foreground">
                <span>
                  {subscription.trialEndsAt
                    ? formatDate(subscription.trialEndsAt, "P")
                    : ""}
                </span>
              </div>
            </div>
          </If>

          <If condition={subscription.cancelAtPeriodEnd}>
            <Alert variant="warning">
              <AlertTitle>Subscription Cancelled</AlertTitle>

              <AlertDescription>
                Your subscription will be cancelled at the end of the period:
                <span className="ml-1">
                  {formatDate(subscription.periodEndsAt ?? "", "P")}
                </span>
              </AlertDescription>
            </Alert>
          </If>

          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">Details</span>

            <LineItemDetails
              lineItems={productLineItems}
              currency={subscription.currency}
              selectedInterval={firstLineItem.interval}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
