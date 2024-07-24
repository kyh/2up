import { Alert, AlertDescription, AlertTitle } from "@init/ui/alert";

import type { Database } from "@init/db/database.types";

export const CurrentPlanAlert = (
  props: React.PropsWithoutRef<{
    status: Database["public"]["Enums"]["SubscriptionStatus"];
  }>,
) => {
  let variant: "success" | "warning" | "destructive";
  let text = "";
  let title = "";

  switch (props.status) {
    case "active":
      title = "Your subscription is active";
      text =
        "Your subscription is active. You can manage your subscription and billing in the Customer Portal.";
      variant = "success";
      break;
    case "trialing":
      title = "You're on a trial";
      text = "You can enjoy the benefits of plan until the trial ends";
      variant = "success";
      break;
    case "past_due":
      title = "Your invoice is past due";
      text = "Your invoice is past due. Please update your payment method.";
      variant = "destructive";
      break;
    case "canceled":
      title = "Your subscription is canceled";
      text =
        "Your subscription is canceled. It is scheduled to end at end of the billing period.";
      variant = "destructive";
      break;
    case "unpaid":
      title = "Your invoice is unpaid";
      text = "Your invoice is unpaid. Please update your payment method.";
      variant = "destructive";
      break;
    case "incomplete":
      title = "We're waiting for your payment";
      text =
        "We're waiting for your payment to go through. Please bear with us.";
      variant = "warning";
      break;
    case "incomplete_expired":
      title = "Your payment has expired";
      text = "Your payment has expired. Please update your payment method.";
      variant = "destructive";
      break;
    case "paused":
      title = "Your subscription is paused";
      text = "Your subscription is paused. You can resume it at any time.";
      variant = "warning";
      break;
  }

  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>

      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
};
