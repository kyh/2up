import { z } from "zod";

export enum LineItemType {
  Flat = "flat",
  PerSeat = "per_seat",
  Metered = "metered",
}

const BillingIntervalSchema = z.enum(["month", "year"]);
const LineItemTypeSchema = z.enum(["flat", "per_seat", "metered"]);

export const PaymentTypeSchema = z.enum(["one-time", "recurring"]);

export const LineItemSchema = z
  .object({
    id: z
      .string({
        description:
          "Unique identifier for the line item. Defined by the Provider.",
      })
      .min(1),
    name: z
      .string({
        description: "Name of the line item. Displayed to the user.",
      })
      .min(1),
    description: z
      .string({
        description:
          "Description of the line item. Displayed to the user and will replace the auto-generated description inferred" +
          " from the line item. This is useful if you want to provide a more detailed description to the user.",
      })
      .optional(),
    cost: z
      .number({
        description: "Cost of the line item. Displayed to the user.",
      })
      .min(0),
    type: LineItemTypeSchema,
    unit: z
      .string({
        description:
          'Unit of the line item. Displayed to the user. Example "seat" or "GB"',
      })
      .optional(),
    tiers: z
      .array(
        z.object({
          cost: z.number().min(0),
          upTo: z.union([z.number().min(0), z.literal("unlimited")]),
        }),
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.type !== LineItemType.Metered ||
      (data.unit && data.tiers !== undefined),
    {
      message: "Metered line items must have a unit and tiers",
      path: ["type", "unit", "tiers"],
    },
  )
  .refine(
    (data) => {
      if (data.type === LineItemType.Metered) {
        return data.cost === 0;
      }

      return true;
    },
    {
      message:
        "Metered line items must have a cost of 0. Please add a different line item type for a flat fee (Stripe)",
      path: ["type", "cost"],
    },
  );

export const PlanSchema = z
  .object({
    id: z
      .string({
        description: "Unique identifier for the plan. Defined by yourself.",
      })
      .min(1),
    name: z
      .string({
        description: "Name of the plan. Displayed to the user.",
      })
      .min(1),
    interval: BillingIntervalSchema.optional(),
    custom: z.boolean().default(false).optional(),
    label: z.string().min(1).optional(),
    buttonLabel: z.string().min(1).optional(),
    href: z.string().min(1).optional(),
    lineItems: z.array(LineItemSchema).refine(
      (schema) => {
        const types = schema.map((item) => item.type);

        const perSeat = types.filter(
          (type) => type === LineItemType.PerSeat,
        ).length;

        const flat = types.filter((type) => type === LineItemType.Flat).length;

        return perSeat <= 1 && flat <= 1;
      },
      {
        message: "Plans can only have one per-seat and one flat line item",
        path: ["lineItems"],
      },
    ),
    trialDays: z
      .number({
        description:
          "Number of days for the trial period. Leave empty for no trial.",
      })
      .positive()
      .optional(),
    paymentType: PaymentTypeSchema,
  })
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: "Non-Custom Plans must have at least one line item",
      path: ["lineItems"],
    },
  )
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: "Custom Plans must have 0 line items",
      path: ["lineItems"],
    },
  )
  .refine(
    (data) => data.paymentType !== "one-time" || data.interval === undefined,
    {
      message: "One-time plans must not have an interval",
      path: ["paymentType", "interval"],
    },
  )
  .refine(
    (data) => data.paymentType !== "recurring" || data.interval !== undefined,
    {
      message: "Recurring plans must have an interval",
      path: ["paymentType", "interval"],
    },
  )
  .refine(
    (item) => {
      const ids = item.lineItems.map((item) => item.id);

      return ids.length === new Set(ids).size;
    },
    {
      message: "Line item IDs must be unique",
      path: ["lineItems"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentType === "one-time") {
        const nonFlatLineItems = data.lineItems.filter(
          (item) => item.type !== LineItemType.Flat,
        );

        return nonFlatLineItems.length === 0;
      }

      return true;
    },
    {
      message: "One-time plans must not have non-flat line items",
      path: ["paymentType", "lineItems"],
    },
  );

const ProductSchema = z
  .object({
    id: z
      .string({
        description:
          "Unique identifier for the product. Defined by th Provider.",
      })
      .min(1),
    name: z
      .string({
        description: "Name of the product. Displayed to the user.",
      })
      .min(1),
    description: z
      .string({
        description: "Description of the product. Displayed to the user.",
      })
      .min(1),
    currency: z
      .string({
        description: "Currency code for the product. Displayed to the user.",
      })
      .min(3)
      .max(3),
    badge: z
      .string({
        description:
          'Badge for the product. Displayed to the user. Example: "Popular"',
      })
      .optional(),
    features: z
      .array(
        z.string({
          description: "Features of the product. Displayed to the user.",
        }),
      )
      .nonempty(),
    enableDiscountField: z
      .boolean({
        description: "Enable discount field for the product in the checkout.",
      })
      .optional(),
    highlighted: z
      .boolean({
        description: "Highlight this product. Displayed to the user.",
      })
      .optional(),
    plans: z.array(PlanSchema),
  })
  .refine((data) => data.plans.length > 0, {
    message: "Products must have at least one plan",
    path: ["plans"],
  })
  .refine(
    (item) => {
      const planIds = item.plans.map((plan) => plan.id);

      return planIds.length === new Set(planIds).size;
    },
    {
      message: "Plan IDs must be unique",
      path: ["plans"],
    },
  );

export const BillingSchema = z
  .object({
    products: z.array(ProductSchema).nonempty(),
  })
  .refine(
    (data) => {
      const ids = data.products.flatMap((product) =>
        product.plans.flatMap((plan) => plan.lineItems.map((item) => item.id)),
      );

      return ids.length === new Set(ids).size;
    },
    {
      message: "Line item IDs must be unique",
      path: ["products"],
    },
  );

export function createBillingSchema(config: z.infer<typeof BillingSchema>) {
  return BillingSchema.parse(config);
}

export type BillingConfig = z.infer<typeof BillingSchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;

export const getSubscriptionInput = z.object({
  accountId: z.string(),
});

export const getOrderInput = z.object({
  accountId: z.string(),
});

export const getCustomerIdInput = z.object({
  accountId: z.string(),
});

export const createCheckoutSessionInput = z.object({
  returnUrl: z.string().url(),
  accountId: z.string().uuid(),
  plan: PlanSchema,
  customerId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  enableDiscountField: z.boolean().optional(),
  variantQuantities: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number(),
    }),
  ),
});

export const createBillingPortalSessionInput = z.object({
  customerId: z.string(),
  returnUrl: z.string().url(),
});

export const retrieveCheckoutSessionInput = z.object({
  sessionId: z.string(),
});

export const handleWebhookEventInput = z.object({
  request: z.any(),
  config: BillingSchema,
});
