import { redirect } from "next/navigation";
import { z } from "zod";

import { api } from "@/trpc/server";

const BILLING_MODE = z
  .enum(["subscription", "one-time"])
  .default("subscription")
  .parse(process.env.BILLING_MODE);

export async function loadBillingPageData() {
  const user = await api.account.me();

  if (!user) {
    return redirect("/account");
  }

  const data =
    BILLING_MODE === "subscription"
      ? await api.billing.getSubscription({ accountId: user.id })
      : await api.billing.getOrder({ accountId: user.id });

  const customerId = await api.billing.getCustomerId({ accountId: user.id });

  return { user, data, customerId };
}
