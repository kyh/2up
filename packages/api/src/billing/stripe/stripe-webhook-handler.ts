import { Database } from "@init/db/database.types";
import Stripe from "stripe";

import { BillingConfig } from "../billing-schema";
import { getLineItemTypeById } from "../billing-util";
import { stripeServerEnvSchema } from "./stripe-schema";
import { createStripeClient } from "./stripe-sdk";

type UpsertSubscriptionParams =
  Database["public"]["Functions"]["upsert_subscription"]["Args"] & {
    line_items: Array<LineItem>;
  };

interface LineItem {
  id: string;
  quantity: number;
  subscription_id: string;
  subscription_item_id: string;
  product_id: string;
  variant_id: string;
  price_amount: number | null | undefined;
  interval: string;
  interval_count: number;
  type: "flat" | "metered" | "per_seat" | undefined;
}

type UpsertOrderParams =
  Database["public"]["Functions"]["upsert_order"]["Args"];

export class StripeWebhookHandlerService {
  private stripe: Stripe | undefined;

  constructor(private readonly config: BillingConfig) {}

  private readonly provider: Database["public"]["Enums"]["billing_provider"] =
    "stripe";

  private readonly namespace = "billing.stripe";

  /**
   * @name verifyWebhookSignature
   * @description Verifies the webhook signature - should throw an error if the signature is invalid
   */
  async verifyWebhookSignature(request: Request) {
    const body = await request.clone().text();
    const signatureKey = `stripe-signature`;
    const signature = request.headers.get(signatureKey)!;

    const { webhooksSecret } = stripeServerEnvSchema.parse({
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
    });

    const stripe = await this.loadStripe();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhooksSecret,
    );

    if (!event) {
      throw new Error("Invalid signature");
    }

    return event;
  }

  /**
   * @name handleWebhookEvent
   * @description Handle the webhook event from the billing provider
   * @param event
   * @param params
   */
  async handleWebhookEvent(
    event: Stripe.Event,
    params: {
      onCheckoutSessionCompleted: (
        data: UpsertSubscriptionParams | UpsertOrderParams,
      ) => Promise<unknown>;
      onSubscriptionUpdated: (
        data: UpsertSubscriptionParams,
      ) => Promise<unknown>;
      onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;
      onPaymentSucceeded: (sessionId: string) => Promise<unknown>;
      onPaymentFailed: (sessionId: string) => Promise<unknown>;
    },
  ) {
    switch (event.type) {
      case "checkout.session.completed": {
        return this.handleCheckoutSessionCompleted(
          event,
          params.onCheckoutSessionCompleted,
        );
      }

      case "customer.subscription.updated": {
        return this.handleSubscriptionUpdatedEvent(
          event,
          params.onSubscriptionUpdated,
        );
      }

      case "customer.subscription.deleted": {
        return this.handleSubscriptionDeletedEvent(
          event,
          params.onSubscriptionDeleted,
        );
      }

      case "checkout.session.async_payment_failed": {
        return this.handleAsyncPaymentFailed(event, params.onPaymentFailed);
      }

      case "checkout.session.async_payment_succeeded": {
        return this.handleAsyncPaymentSucceeded(
          event,
          params.onPaymentSucceeded,
        );
      }

      default: {
        return;
      }
    }
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
    onCheckoutCompletedCallback: (
      data: UpsertSubscriptionParams | UpsertOrderParams,
    ) => Promise<unknown>,
  ) {
    const stripe = await this.loadStripe();

    const session = event.data.object;
    const isSubscription = session.mode === "subscription";

    const accountId = session.client_reference_id!;
    const customerId = session.customer as string;

    // if it's a subscription, we need to retrieve the subscription
    // and build the payload for the subscription
    if (isSubscription) {
      const subscriptionPayloadBuilderService =
        new StripeSubscriptionPayloadBuilderService();

      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const payload = subscriptionPayloadBuilderService
        .withBillingConfig(this.config)
        .build({
          accountId,
          customerId,
          id: subscription.id,
          lineItems: subscription.items.data,
          status: subscription.status,
          currency: subscription.currency,
          periodStartsAt: subscription.current_period_start,
          periodEndsAt: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialStartsAt: subscription.trial_start,
          trialEndsAt: subscription.trial_end,
        });

      return onCheckoutCompletedCallback(payload);
    } else {
      // if it's a one-time payment, we need to retrieve the session
      const sessionId = event.data.object.id;

      // from the session, we need to retrieve the line items
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        },
      );

      const lineItems = sessionWithLineItems.line_items?.data ?? [];
      const paymentStatus = sessionWithLineItems.payment_status;
      const status = paymentStatus === "unpaid" ? "pending" : "succeeded";
      const currency = event.data.object.currency as string;

      const payload: UpsertOrderParams = {
        target_account_id: accountId,
        target_customer_id: customerId,
        target_order_id: sessionId,
        billing_provider: this.provider,
        status: status,
        currency: currency,
        total_amount: sessionWithLineItems.amount_total ?? 0,
        line_items: lineItems.map((item) => {
          const price = item.price as Stripe.Price;

          return {
            id: item.id,
            product_id: price.product as string,
            variant_id: price.id,
            price_amount: price.unit_amount,
            quantity: item.quantity,
          };
        }),
      };

      return onCheckoutCompletedCallback(payload);
    }
  }

  private handleAsyncPaymentFailed(
    event: Stripe.CheckoutSessionAsyncPaymentFailedEvent,
    onPaymentFailed: (sessionId: string) => Promise<unknown>,
  ) {
    const sessionId = event.data.object.id;

    return onPaymentFailed(sessionId);
  }

  private handleAsyncPaymentSucceeded(
    event: Stripe.CheckoutSessionAsyncPaymentSucceededEvent,
    onPaymentSucceeded: (sessionId: string) => Promise<unknown>,
  ) {
    const sessionId = event.data.object.id;

    return onPaymentSucceeded(sessionId);
  }

  private handleSubscriptionUpdatedEvent(
    event: Stripe.CustomerSubscriptionUpdatedEvent,
    onSubscriptionUpdatedCallback: (
      subscription: UpsertSubscriptionParams,
    ) => Promise<unknown>,
  ) {
    const subscription = event.data.object;
    const subscriptionId = subscription.id;
    const accountId = subscription.metadata.accountId as string;

    const subscriptionPayloadBuilderService =
      new StripeSubscriptionPayloadBuilderService();

    const payload = subscriptionPayloadBuilderService
      .withBillingConfig(this.config)
      .build({
        customerId: subscription.customer as string,
        id: subscriptionId,
        accountId,
        lineItems: subscription.items.data,
        status: subscription.status,
        currency: subscription.currency,
        periodStartsAt: subscription.current_period_start,
        periodEndsAt: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStartsAt: subscription.trial_start,
        trialEndsAt: subscription.trial_end,
      });

    return onSubscriptionUpdatedCallback(payload);
  }

  private handleSubscriptionDeletedEvent(
    event: Stripe.CustomerSubscriptionDeletedEvent,
    onSubscriptionDeletedCallback: (subscriptionId: string) => Promise<unknown>,
  ) {
    // Here we don't need to do anything, so we just return the callback

    return onSubscriptionDeletedCallback(event.data.object.id);
  }

  private async handleInvoicePaid(
    event: Stripe.InvoicePaidEvent,
    onInvoicePaid: (data: UpsertSubscriptionParams) => Promise<unknown>,
  ) {
    const stripe = await this.loadStripe();

    const invoice = event.data.object;
    const subscriptionId = invoice.subscription as string;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["line_items"],
    });

    const accountId = subscription.metadata.accountId as string;

    const subscriptionPayloadBuilderService =
      new StripeSubscriptionPayloadBuilderService();

    const payload = subscriptionPayloadBuilderService
      .withBillingConfig(this.config)
      .build({
        customerId: subscription.customer as string,
        id: subscriptionId,
        accountId,
        lineItems: subscription.items.data,
        status: subscription.status,
        currency: subscription.currency,
        periodStartsAt: subscription.current_period_start,
        periodEndsAt: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStartsAt: subscription.trial_start,
        trialEndsAt: subscription.trial_end,
      });

    return onInvoicePaid(payload);
  }

  private async loadStripe() {
    if (!this.stripe) {
      this.stripe = await createStripeClient();
    }

    return this.stripe;
  }
}

/**
 * @name StripeSubscriptionPayloadBuilderService
 * @description This class is used to build the subscription payload for Stripe
 */
class StripeSubscriptionPayloadBuilderService {
  private config?: BillingConfig;

  /**
   * @name withBillingConfig
   * @description Set the billing config for the subscription payload
   * @param config
   */
  withBillingConfig(config: BillingConfig) {
    this.config = config;

    return this;
  }

  /**
   * @name build
   * @description Build the subscription payload for Stripe
   * @param params
   */
  build<
    LineItem extends {
      id: string;
      quantity?: number;
      price?: Stripe.Price;
    },
  >(params: {
    id: string;
    accountId: string;
    customerId: string;
    lineItems: LineItem[];
    status: Stripe.Subscription.Status;
    currency: string;
    cancelAtPeriodEnd: boolean;
    periodStartsAt: number;
    periodEndsAt: number;
    trialStartsAt: number | null;
    trialEndsAt: number | null;
  }): UpsertSubscriptionParams {
    const active = params.status === "active" || params.status === "trialing";

    const lineItems = params.lineItems.map((item) => {
      const quantity = item.quantity ?? 1;
      const variantId = item.price?.id as string;

      return {
        id: item.id,
        quantity,
        subscription_id: params.id,
        subscription_item_id: item.id,
        product_id: item.price?.product as string,
        variant_id: variantId,
        price_amount: item.price?.unit_amount,
        interval: item.price?.recurring?.interval as string,
        interval_count: item.price?.recurring?.interval_count as number,
        type: this.config
          ? getLineItemTypeById(this.config, variantId)
          : undefined,
      };
    });

    // otherwise we are updating a subscription
    // and we only need to return the update payload
    return {
      target_subscription_id: params.id,
      target_account_id: params.accountId,
      target_customer_id: params.customerId,
      billing_provider: "stripe",
      status: params.status,
      line_items: lineItems,
      active,
      currency: params.currency,
      cancel_at_period_end: params.cancelAtPeriodEnd ?? false,
      period_starts_at: getISOString(params.periodStartsAt) as string,
      period_ends_at: getISOString(params.periodEndsAt) as string,
      trial_starts_at: getISOString(params.trialStartsAt),
      trial_ends_at: getISOString(params.trialEndsAt),
    };
  }
}

function getISOString(date: number | null) {
  return date ? new Date(date * 1000).toISOString() : undefined;
}
