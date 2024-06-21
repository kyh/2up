import { createBillingSchema } from "@init/api/billing/billing-schema";

export const siteConfig = {
  name: "Init",
  shortName: "Init",
  description:
    "A comprehensive boilerplate to build, launch, and scale your next project",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://init.kyh.io",
  twitter: "@kaiyuhsu",
};

export const billingConfig = createBillingSchema({
  products: [
    {
      id: "prod_QKW69SwmjHmj2s",
      name: "Starter",
      description: "The perfect plan to get started",
      currency: "USD",
      badge: `Value`,
      plans: [
        {
          name: "Starter Monthly",
          id: "starter-monthly",
          paymentType: "recurring",
          interval: "month",
          lineItems: [
            {
              id: "price_1PTr9kLVsDjMsD8IEknnLZvH",
              name: "Addon 2",
              cost: 9.99,
              type: "flat" as const,
            },
          ],
        },
        {
          name: "Starter Yearly",
          id: "starter-yearly",
          paymentType: "recurring",
          interval: "year",
          lineItems: [
            {
              id: "price_1PTr9kLVsDjMsD8I97LonZuR",
              name: "Base",
              cost: 99.99,
              type: "flat" as const,
            },
          ],
        },
      ],
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      id: "prod_QKWE7U9BmKyTs8",
      name: "Pro",
      badge: `Popular`,
      highlighted: true,
      description: "The perfect plan for professionals",
      currency: "USD",
      plans: [
        {
          name: "Pro Monthly",
          id: "pro-monthly",
          paymentType: "recurring",
          interval: "month",
          lineItems: [
            {
              id: "price_1PTrCWLVsDjMsD8I2PPNmcuF",
              name: "Base",
              cost: 19.99,
              type: "flat",
            },
          ],
        },
        {
          name: "Pro Yearly",
          id: "pro-yearly",
          paymentType: "recurring",
          interval: "year",
          lineItems: [
            {
              id: "price_1PTrCWLVsDjMsD8IwAJ9md9D",
              name: "Base",
              cost: 199.99,
              type: "flat",
            },
          ],
        },
      ],
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
      ],
    },
    {
      id: "prod_QKWGWWrTeCQoOI",
      name: "Enterprise",
      description: "The perfect plan for enterprises",
      currency: "USD",
      plans: [
        {
          name: "Enterprise Monthly",
          id: "enterprise-monthly",
          paymentType: "recurring",
          interval: "month",
          lineItems: [
            {
              id: "price_1PTrDULVsDjMsD8Inr2Vu9Cm",
              name: "Base",
              cost: 29.99,
              type: "flat",
            },
          ],
        },
        {
          name: "Enterprise Yearly",
          id: "enterprise-yearly",
          paymentType: "recurring",
          interval: "year",
          lineItems: [
            {
              id: "price_1PTrDvLVsDjMsD8I4VWMOVtA",
              name: "Base",
              cost: 299.99,
              type: "flat",
            },
          ],
        },
      ],
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
        "Feature 6",
        "Feature 7",
      ],
    },
  ],
});
