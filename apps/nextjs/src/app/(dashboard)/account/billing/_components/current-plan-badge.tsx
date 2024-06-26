import { Badge } from "@init/ui/badge";

import type { Database } from "@init/db/database.types";

type Status =
  | Database["public"]["Enums"]["subscription_status"]
  | Database["public"]["Enums"]["payment_status"];

export function CurrentPlanBadge(
  props: React.PropsWithoutRef<{
    status: Status;
  }>,
) {
  let variant: "success" | "warning" | "destructive";
  let text = "";

  switch (props.status) {
    case "active":
      text = "Active";
      variant = "success";
      break;
    case "succeeded":
      text = "Succeeded";
      variant = "success";
      break;
    case "trialing":
      text = "Trial";
      variant = "success";
      break;
    case "past_due":
      text = "Past Due";
      variant = "destructive";
    case "failed":
      text = "Failed";
      variant = "destructive";
      break;
    case "canceled":
      text = "Canceled";
      variant = "destructive";
      break;
    case "unpaid":
      text = "Unpaid";
      variant = "destructive";
      break;
    case "incomplete":
      text = "Incomplete";
      variant = "warning";
      break;
    case "pending":
      text = "Pending";
      variant = "warning";
      break;
    case "incomplete_expired":
      text = "Expired";
      variant = "destructive";
      break;
    case "paused":
      text = "Paused";
      variant = "warning";
      break;
  }

  return <Badge variant={variant}>{text}</Badge>;
}
