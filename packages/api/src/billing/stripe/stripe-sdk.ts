import "server-only";

import { stripeServerEnvSchema } from "./stripe-schema";

const STRIPE_API_VERSION = "2024-04-10";

/**
 * @description returns a Stripe instance
 */
export async function createStripeClient() {
  const { default: Stripe } = await import("stripe");

  // Parse the environment variables and validate them
  const stripeServerEnv = stripeServerEnvSchema.parse({
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
  });

  return new Stripe(stripeServerEnv.secretKey, {
    apiVersion: STRIPE_API_VERSION,
  });
}
