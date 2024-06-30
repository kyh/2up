"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatCurrency,
  getPlanIntervals,
  getPrimaryLineItem,
  getProductPlanPair,
} from "@init/api/billing/billing-util";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@init/ui/form";
import { Heading } from "@init/ui/heading";
import { If } from "@init/ui/if";
import { Label } from "@init/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from "@init/ui/radio-group";
import { Separator } from "@init/ui/separator";
import { cn } from "@init/ui/utils";
import { ArrowRightIcon, CircleCheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  BillingConfig,
  LineItemSchema,
} from "@init/api/billing/billing-schema";
import { LineItemDetails } from "./line-item-details";

export const PlanPicker = (
  props: React.PropsWithChildren<{
    config: BillingConfig;
    onSubmit: (data: { planId: string; productId: string }) => void;
    canStartTrial?: boolean;
    pending?: boolean;
  }>,
) => {
  const intervals = useMemo(
    () => getPlanIntervals(props.config),
    [props.config],
  ) as string[];

  const form = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(
      z
        .object({
          planId: z.string(),
          productId: z.string(),
          interval: z.string().optional(),
        })
        .refine(
          (data) => {
            try {
              const { product, plan } = getProductPlanPair(
                props.config,
                data.planId,
              );

              return product && plan;
            } catch {
              return false;
            }
          },
          { message: "Please choose a plan", path: ["planId"] },
        ),
    ),
    defaultValues: {
      interval: intervals[0],
      planId: "",
      productId: "",
    },
  });

  const { interval: selectedInterval } = form.watch();
  const planId = form.getValues("planId");

  const { plan: selectedPlan, product: selectedProduct } = useMemo(() => {
    try {
      return getProductPlanPair(props.config, planId);
    } catch {
      return {
        plan: null,
        product: null,
      };
    }
  }, [props.config, planId]);

  // display the period picker if the selected plan is recurring or if no plan is selected
  const isRecurringPlan =
    selectedPlan?.paymentType === "recurring" || !selectedPlan;

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <form
          className="flex w-full max-w-xl flex-col space-y-4"
          onSubmit={form.handleSubmit(props.onSubmit)}
        >
          <If condition={intervals.length}>
            <div
              className={cn("transition-all", {
                ["pointer-events-none opacity-50"]: !isRecurringPlan,
              })}
            >
              <FormField
                name="interval"
                render={({ field }) => {
                  return (
                    <FormItem className="rounded-md border p-4">
                      <FormLabel htmlFor="plan-picker-id">
                        Choose your billing interval
                      </FormLabel>

                      <FormControl id="plan-picker-id">
                        <RadioGroup name={field.name} value={field.value}>
                          <div className="flex space-x-2.5">
                            {intervals.map((interval) => {
                              const selected = field.value === interval;

                              return (
                                <label
                                  htmlFor={interval}
                                  key={interval}
                                  className={cn(
                                    "flex items-center space-x-2 rounded-md border border-transparent px-4 py-2 transition-colors",
                                    {
                                      ["border-primary"]: selected,
                                      ["hover:border-primary"]: !selected,
                                    },
                                  )}
                                >
                                  <RadioGroupItem
                                    id={interval}
                                    value={interval}
                                    onClick={() => {
                                      form.setValue("interval", interval, {
                                        shouldValidate: true,
                                      });

                                      if (selectedProduct) {
                                        const plan = selectedProduct.plans.find(
                                          (item) => item.interval === interval,
                                        );

                                        form.setValue(
                                          "planId",
                                          plan?.id ?? "",
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                            shouldTouch: true,
                                          },
                                        );
                                      }
                                    }}
                                  />

                                  <span
                                    className={cn("text-sm", {
                                      ["cursor-pointer"]: !selected,
                                    })}
                                  >
                                    {interval == "month" && "Billed monthly"}
                                    {interval == "year" && "Billed yearly"}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </If>

          <FormField
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pick your preferred plan</FormLabel>

                <FormControl>
                  <RadioGroup value={field.value} name={field.name}>
                    {props.config.products.map((product) => {
                      const plan = product.plans.find((item) => {
                        if (item.paymentType === "one-time") {
                          return true;
                        }

                        return item.interval === selectedInterval;
                      });

                      if (!plan || plan.custom) {
                        return null;
                      }

                      const planId = plan.id;
                      const selected = field.value === planId;

                      const primaryLineItem = getPrimaryLineItem(
                        props.config,
                        planId,
                      );

                      if (!primaryLineItem) {
                        throw new Error(`Base line item was not found`);
                      }

                      return (
                        <RadioGroupItemLabel
                          selected={selected}
                          key={primaryLineItem.id}
                        >
                          <RadioGroupItem
                            key={plan.id + selected}
                            id={plan.id}
                            value={plan.id}
                            onClick={() => {
                              if (selected) {
                                return;
                              }

                              form.setValue("planId", planId, {
                                shouldValidate: true,
                              });

                              form.setValue("productId", product.id, {
                                shouldValidate: true,
                              });
                            }}
                          />

                          <div className="flex w-full flex-col content-center space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                            <Label
                              htmlFor={plan.id}
                              className="flex flex-col justify-center space-y-2"
                            >
                              <div className="flex items-center space-x-2.5">
                                <span className="font-semibold">
                                  {product.name}
                                </span>

                                <If
                                  condition={
                                    plan.trialDays && props.canStartTrial
                                  }
                                >
                                  <div>
                                    <Badge
                                      className="px-1 py-0.5 text-xs"
                                      variant="success"
                                    >
                                      {plan.trialDays} day trial
                                    </Badge>
                                  </div>
                                </If>
                              </div>

                              <span className="text-muted-foreground">
                                {product.description}
                              </span>
                            </Label>

                            <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0 lg:text-right">
                              <div>
                                <Price key={plan.id}>
                                  <span>
                                    {formatCurrency(
                                      product.currency.toLowerCase(),
                                      primaryLineItem.cost,
                                    )}
                                  </span>
                                </Price>

                                <div>
                                  <span className="text-muted-foreground">
                                    <If
                                      condition={
                                        plan.paymentType === "recurring"
                                      }
                                      fallback="Lifetime"
                                    >
                                      per {selectedInterval}
                                    </If>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </RadioGroupItemLabel>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={props.pending ?? !form.formState.isValid}>
              {props.pending ? (
                "Redirecting to checkout. Please wait..."
              ) : (
                <>
                  <If
                    condition={selectedPlan?.trialDays && props.canStartTrial}
                    fallback="Proceed to Payment"
                  >
                    <span>Start Trial</span>
                  </If>

                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        {selectedPlan && selectedInterval && selectedProduct ? (
          <PlanDetails
            selectedInterval={selectedInterval}
            selectedPlan={selectedPlan}
            selectedProduct={selectedProduct}
          />
        ) : null}
      </div>
    </Form>
  );
};

const PlanDetails = ({
  selectedProduct,
  selectedInterval,
  selectedPlan,
}: {
  selectedProduct: {
    id: string;
    name: string;
    description: string;
    currency: string;
    features: string[];
  };

  selectedInterval: string;

  selectedPlan: {
    lineItems: z.infer<typeof LineItemSchema>[];
    paymentType: string;
  };
}) => {
  const isRecurring = selectedPlan.paymentType === "recurring";

  // trick to force animation on re-render
  const key = Math.random();

  return (
    <div
      key={key}
      className="flex w-full flex-col space-y-4 py-2 animate-in fade-in zoom-in-95 lg:px-8"
    >
      <div className="flex flex-col space-y-0.5">
        <Heading level={5}>
          <b>{selectedProduct.name}</b>{" "}
          <If condition={isRecurring}>
            {selectedInterval == "month" && "/ Billed monthly"}
            {selectedInterval == "year" && "/ Billed yearly"}
          </If>
        </Heading>

        <p>
          <span className="text-muted-foreground">
            {selectedProduct.description}
          </span>
        </p>
      </div>

      <If condition={selectedPlan.lineItems.length > 0}>
        <Separator />

        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold">Details</span>

          <LineItemDetails
            lineItems={selectedPlan.lineItems ?? []}
            selectedInterval={isRecurring ? selectedInterval : undefined}
            currency={selectedProduct.currency}
          />
        </div>
      </If>

      <Separator />

      <div className="flex flex-col space-y-2">
        <span className="text-sm font-semibold">Features</span>

        {selectedProduct.features.map((item) => {
          return (
            <div key={item} className="flex items-center space-x-1 text-sm">
              <CircleCheckIcon className="h-4 text-green-500" />

              <span className="text-secondary-foreground">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Price = (props: React.PropsWithChildren) => (
  <span className="text-xl font-bold duration-500 animate-in fade-in slide-in-from-left-4">
    {props.children}
  </span>
);
