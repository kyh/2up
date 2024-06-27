import { LineItemSchema } from "@init/api/billing/billing-schema";
import { formatCurrency } from "@init/api/billing/billing-util";
import { If } from "@init/ui/if";
import { cn } from "@init/ui/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { z } from "zod";

const className = "flex text-secondary-foreground items-center text-sm";

export function LineItemDetails(
  props: React.PropsWithChildren<{
    lineItems: z.infer<typeof LineItemSchema>[];
    currency: string;
    selectedInterval?: string | undefined;
  }>,
) {
  return (
    <div className={"flex flex-col space-y-1"}>
      {props.lineItems.map((item, index) => {
        // If the item has a description, we render it as a simple text
        // and pass the item as values to the translation so we can use
        // the item properties in the translation.
        if (item.description) {
          return (
            <div key={index} className={className}>
              <span className={"flex items-center space-x-1.5"}>
                <PlusIcon className={"w-4"} />
                {item.description}
              </span>
            </div>
          );
        }

        const SetupFee = () => (
          <If condition={item.setupFee}>
            <div className={className}>
              <span className={"flex items-center space-x-1"}>
                <PlusIcon className={"w-3"} />

                <span>
                  {`plus a ${formatCurrency(props?.currency.toLowerCase(), item.setupFee as number)} setup fee`}
                </span>
              </span>
            </div>
          </If>
        );

        const FlatFee = () => (
          <div className={"flex flex-col"}>
            <div className={cn(className, "space-x-1")}>
              <span className={"flex items-center space-x-1"}>
                <span className={"flex items-center space-x-1.5"}>
                  <PlusIcon className={"w-3"} />

                  <span>Base Plan</span>
                </span>

                <span>
                  <If condition={props.selectedInterval} fallback={"Lifetime"}>
                    {props.selectedInterval == "month" && "Billed monthly"}
                    {props.selectedInterval == "year" && "Billed yearly"}
                  </If>
                </span>
              </span>

              <span>-</span>

              <span className={"text-xs font-semibold"}>
                {formatCurrency(props?.currency.toLowerCase(), item.cost)}
              </span>
            </div>

            <SetupFee />

            <If condition={item.tiers?.length}>
              <span className={"flex items-center space-x-1.5"}>
                <PlusIcon className={"w-3"} />

                <span className={"flex space-x-1 text-sm"}>
                  <span>Per {item.unit} usage</span>
                </span>
              </span>

              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        const PerSeat = () => (
          <div key={index} className={"flex flex-col"}>
            <div className={className}>
              <span className={"flex items-center space-x-1.5"}>
                <PlusIcon className={"w-3"} />

                <span>Per team member</span>
              </span>

              <If condition={!item.tiers?.length}>
                <span className={"font-semibold"}>
                  {formatCurrency(props.currency.toLowerCase(), item.cost)}
                </span>
              </If>
            </div>

            <SetupFee />

            <If condition={item.tiers?.length}>
              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        const Metered = () => (
          <div key={index} className={"flex flex-col"}>
            <div className={className}>
              <span className={"flex items-center space-x-1"}>
                <span className={"flex items-center space-x-1.5"}>
                  <PlusIcon className={"w-3"} />

                  <span className={"flex space-x-1"}>
                    <span>Per {item.unit} usage</span>
                  </span>
                </span>
              </span>

              {/* If there are no tiers, there is a flat cost for usage */}
              <If condition={!item.tiers?.length}>
                <span className={"font-semibold"}>
                  {formatCurrency(props?.currency.toLowerCase(), item.cost)}
                </span>
              </If>
            </div>

            <SetupFee />

            {/* If there are tiers, we render them as a list */}
            <If condition={item.tiers?.length}>
              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        switch (item.type) {
          case "flat":
            return <FlatFee key={item.id} />;

          case "per_seat":
            return <PerSeat key={item.id} />;

          case "metered": {
            return <Metered key={item.id} />;
          }
        }
      })}
    </div>
  );
}

function Tiers({
  currency,
  item,
}: {
  currency: string;
  item: z.infer<typeof LineItemSchema>;
}) {
  const unit = item.unit;

  const tiers = item.tiers?.map((tier, index) => {
    const tiersLength = item.tiers?.length ?? 0;
    const previousTier = item.tiers?.[index - 1];
    const isLastTier = tier.upTo === "unlimited";

    const previousTierFrom =
      previousTier?.upTo === "unlimited"
        ? "unlimited"
        : previousTier === undefined
          ? 0
          : previousTier.upTo + 1 || 0;

    const upTo = tier.upTo;
    const isIncluded = tier.cost === 0;

    return (
      <span
        className={"flex space-x-1 text-xs text-secondary-foreground"}
        key={index}
      >
        <span>-</span>

        <If condition={isLastTier}>
          <span className={"font-bold"}>
            {formatCurrency(currency.toLowerCase(), tier.cost)}
          </span>

          <If condition={tiersLength > 1}>
            <span>
              above {(previousTierFrom as number) - 1} {unit}
            </span>
          </If>

          <If condition={tiersLength === 1}>
            <span>for every {unit}</span>
          </If>
        </If>

        <If condition={!isLastTier}>
          <If condition={isIncluded}>
            <span>
              Up to {upTo} {unit} included in the plan
            </span>
          </If>

          <If condition={!isIncluded}>
            <span className={"font-bold"}>
              {formatCurrency(currency.toLowerCase(), tier.cost)}
            </span>

            <span>
              for each {unit} for the next {upTo} {unit}
            </span>
          </If>
        </If>
      </span>
    );
  });

  return <div className={"my-1 flex flex-col space-y-1.5"}>{tiers}</div>;
}
