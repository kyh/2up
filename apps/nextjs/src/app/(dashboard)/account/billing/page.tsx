import { If } from "@init/ui/if";

import { billingConfig } from "@/lib/config";
import { BillingPortalCard } from "./_components/billing-portal-card";
import { CheckoutForm } from "./_components/checkout-form";
import { CurrentLifetimeOrderCard } from "./_components/current-lifetime-order-card";
import { CurrentSubscriptionCard } from "./_components/current-subscription-card";
import { loadBillingPageData } from "./_lib/billing-page-loader";

const Page = async () => {
  const { user, data, customerId } = await loadBillingPageData();

  return (
    <section>
      <If condition={!data}>
        <CheckoutForm
          userId={user.id}
          userEmail={user.email}
          customerId={customerId}
        />

        <If condition={customerId}>
          <BillingPortalCard customerId={customerId} />
        </If>
      </If>

      <If condition={data}>
        {(data) => (
          <div className={"flex w-full flex-col space-y-6"}>
            {"active" in data ? (
              <CurrentSubscriptionCard
                subscription={data}
                config={billingConfig}
              />
            ) : (
              <CurrentLifetimeOrderCard order={data} config={billingConfig} />
            )}
          </div>
        )}
      </If>
    </section>
  );
};

export default Page;
