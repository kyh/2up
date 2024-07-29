import type { Stripe } from "stripe";
import { getSupabaseServerClient } from "@init/db/supabase-server-client";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createBillingPortalSessionInput,
  createCheckoutSessionInput,
  getCheckoutSessionInput,
  getCustomerIdInput,
  getOrderInput,
  getSubscriptionInput,
  handleWebhookEventInput,
} from "./billing-schema";
import { createStripeClient } from "./stripe/stripe-sdk";
import { StripeWebhookHandlerService } from "./stripe/stripe-webhook-handler";

export const billingRouter = createTRPCRouter({
  getSubscription: protectedProcedure
    .input(getSubscriptionInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Subscriptions")
        .select("*, items: SubscriptionItems !inner (*)")
        .eq("accountId", input.accountId)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getOrder: protectedProcedure
    .input(getOrderInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Orders")
        .select("*, items: OrderItems !inner (*)")
        .eq("accountId", input.accountId)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getCustomerId: protectedProcedure
    .input(getCustomerIdInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("BillingCustomers")
        .select("customerId")
        .eq("accountId", input.accountId)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      return response.data?.customerId;
    }),
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionInput)
    .mutation(async ({ ctx, input }) => {
      // a subscription belongs to an organization,
      // rather than to a user
      // if you wish to change it, use the current user ID instead
      const clientReferenceId = input.accountId;

      // we pass an optional customer ID, so we do not duplicate the Stripe
      // customers if an organization subscribes multiple times
      const customer = input.customerId ?? undefined;

      // docs: https://stripe.com/docs/billing/subscriptions/build-subscription
      const mode: Stripe.Checkout.SessionCreateParams.Mode =
        input.plan.paymentType === "recurring" ? "subscription" : "payment";

      const isSubscription = mode === "subscription";

      // this should only be set if the mode is 'subscription'
      const subscriptionData:
        | Stripe.Checkout.SessionCreateParams.SubscriptionData
        | undefined = isSubscription
        ? {
            trial_period_days: input.plan.trialDays,
            metadata: {
              accountId: input.accountId,
            },
          }
        : {};

      const urls = getUrls({
        returnUrl: input.returnUrl,
      });

      // we use the embedded mode, so the user does not leave the page
      const uiMode = "embedded";

      const customerData = customer
        ? {
            customer,
          }
        : {
            customer_email: input.customerEmail,
          };

      const customerCreation =
        isSubscription || customer
          ? ({} as Record<string, string>)
          : { customer_creation: "always" };

      const lineItems = input.plan.lineItems.map((item) => {
        if (item.type === "metered") {
          return {
            price: item.id,
          };
        }

        // if we pass a custom quantity for the item ID
        // we use that - otherwise we set it to 1 by default
        const quantity =
          input.variantQuantities.find((variant) => {
            return variant.variantId === item.id;
          })?.quantity ?? 1;

        return {
          price: item.id,
          quantity,
        };
      });

      const stripe = await createStripeClient();

      const { client_secret } = await stripe.checkout.sessions.create({
        mode,
        allow_promotion_codes: input.enableDiscountField,
        ui_mode: uiMode,
        line_items: lineItems,
        client_reference_id: clientReferenceId,
        subscription_data: subscriptionData,
        ...customerCreation,
        ...customerData,
        ...urls,
      });

      if (!client_secret) {
        throw new Error("Failed to create checkout session");
      }

      return { checkoutToken: client_secret };
    }),
  getCheckoutSession: protectedProcedure
    .input(getCheckoutSessionInput)
    .query(async ({ ctx, input }) => {
      const stripe = await createStripeClient();
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      const isSessionOpen = session.status === "open";
      return {
        checkoutToken: session.client_secret,
        isSessionOpen,
        status: session.status ?? "complete",
        customer: {
          email: session.customer_details?.email ?? null,
        },
      };
    }),

  createBillingPortalSession: protectedProcedure
    .input(createBillingPortalSessionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const stripe = await createStripeClient();
        const session = await stripe.billingPortal.sessions.create({
          customer: input.customerId,
          return_url: input.returnUrl,
        });

        return session.url;
      } catch (error) {
        throw new Error(
          `Encountered an error creating the Billing Portal session`,
        );
      }
    }),

  handleWebhookEvent: publicProcedure
    .input(handleWebhookEventInput)
    .query(async ({ ctx, input }) => {
      const adminSupabase = getSupabaseServerClient({ admin: true });
      const service = new StripeWebhookHandlerService(input.config);
      const event = await service.verifyWebhookSignature(input.request);

      if (!event) {
        throw new Error("Invalid signature");
      }

      return service.handleWebhookEvent(event, {
        onSubscriptionDeleted: async (subscriptionId: string) => {
          // Handle the subscription deleted event
          // here we delete the subscription from the database

          const { error } = await adminSupabase
            .from("Subscriptions")
            .delete()
            .match({ id: subscriptionId });

          if (error) {
            throw new Error("Failed to delete subscription");
          }
        },
        onSubscriptionUpdated: async (subscription) => {
          // Handle the subscription updated event
          // here we update the subscription in the database
          const { error } = await adminSupabase.rpc(
            "upsertSubscription",
            subscription,
          );

          if (error) {
            throw new Error("Failed to update subscription");
          }
        },
        onCheckoutSessionCompleted: async (payload) => {
          // Handle the checkout session completed event
          // here we add the subscription to the database

          // Check if the payload contains an order_id
          // if it does, we add an order, otherwise we add a subscription

          if ("targetOrderId" in payload) {
            const { error } = await adminSupabase.rpc("upsertOrder", payload);

            if (error) {
              throw new Error("Failed to add order");
            }
          } else {
            const { error } = await adminSupabase.rpc(
              "upsertSubscription",
              payload,
            );

            // handle the error
            if (error) {
              throw new Error("Failed to add subscription");
            }
          }
        },
        onPaymentSucceeded: async (sessionId: string) => {
          // Handle the payment succeeded event
          // here we update the payment status in the database

          const { error } = await adminSupabase
            .from("Orders")
            .update({ status: "succeeded" })
            .match({ sessionId: sessionId });

          // handle the error
          if (error) {
            throw new Error("Failed to update payment status");
          }
        },
        onPaymentFailed: async (sessionId: string) => {
          // Handle the payment failed event
          // here we update the payment status in the database

          const { error } = await adminSupabase
            .from("Orders")
            .update({ status: "failed" })
            .match({ sessionId: sessionId });

          if (error) {
            throw new Error("Failed to update payment status");
          }
        },
      });
    }),
});

const getUrls = (params: { returnUrl: string }) => {
  const returnUrl = `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}`;

  return {
    return_url: returnUrl,
  };
};
