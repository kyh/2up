import type { NextRequest } from "next/server";

import { billingConfig } from "@/lib/config";
import { api } from "@/trpc/server";

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export const POST = async (request: NextRequest) => {
  try {
    await api.billing.handleWebhookEvent({ request, config: billingConfig });

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Failed to process billing webhook", {
      status: 500,
    });
  }
};
