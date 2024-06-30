import type { z } from "zod";

import type { BillingConfig, BillingSchema } from "./billing-schema";
import { LineItemType } from "./billing-schema";

/**
 *@name formatCurrency
 * @description Format the currency based on the currency code
 */
export const formatCurrency = (currencyCode: string, value: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(value));

export const getPlanIntervals = (config: z.infer<typeof BillingSchema>) => {
  const intervals = config.products
    .flatMap((product) => product.plans.map((plan) => plan.interval))
    .filter(Boolean);

  return Array.from(new Set(intervals));
};

/**
 * @name getPrimaryLineItem
 * @description Get the primary line item for a plan
 * By default, the primary line item is the first line item in the plan for Lemon Squeezy
 * For other providers, the primary line item is the first flat line item in the plan. If there are no flat line items,
 * the first line item is returned.
 *
 * @param config
 * @param planId
 */
export const getPrimaryLineItem = (
  config: z.infer<typeof BillingSchema>,
  planId: string,
) => {
  for (const product of config.products) {
    for (const plan of product.plans) {
      if (plan.id === planId) {
        const flatLineItem = plan.lineItems.find(
          (item) => item.type === LineItemType.Flat,
        );

        if (flatLineItem) {
          return flatLineItem;
        }

        return plan.lineItems[0];
      }
    }
  }

  throw new Error("Base line item not found");
};

export const getProductPlanPair = (config: BillingConfig, planId: string) => {
  for (const product of config.products) {
    for (const plan of product.plans) {
      if (plan.id === planId) {
        return { product, plan };
      }
    }
  }

  throw new Error("Plan not found");
};

export const getProductPlanPairByVariantId = (
  config: BillingConfig,
  planId: string,
) => {
  for (const product of config.products) {
    for (const plan of product.plans) {
      for (const lineItem of plan.lineItems) {
        if (lineItem.id === planId) {
          return { product, plan };
        }
      }
    }
  }

  throw new Error("Plan not found");
};

export const getLineItemTypeById = (config: BillingConfig, id: string) => {
  for (const product of config.products) {
    for (const plan of product.plans) {
      for (const lineItem of plan.lineItems) {
        if (lineItem.id === id) {
          return lineItem.type;
        }
      }
    }
  }

  throw new Error(`Line Item with ID ${id} not found`);
};
