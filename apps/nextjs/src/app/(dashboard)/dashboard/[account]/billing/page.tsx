import { redirect } from "next/navigation";
import { If } from "@init/ui/if";

import { billingConfig } from "@/config/billing.config";
import { api } from "@/trpc/server";
import { BillingPortalCard } from "./_components/billing-portal-card";
import { CheckoutForm } from "./_components/checkout-form";
import { CurrentLifetimeOrderCard } from "./_components/current-lifetime-order-card";
import { CurrentSubscriptionCard } from "./_components/current-subscription-card";

const Page = async () => {
  const user = await api.account.me();

  if (!user) {
    return redirect("/account");
  }

  const data = await api.billing.getSubscription({ accountId: user.id });
  const customerId = await api.billing.getCustomerId({ accountId: user.id });

  return (
    <section>
      <If condition={!data}>
        <CheckoutForm
          userId={user.id}
          userEmail={user.email}
          customerId={customerId}
        />
        {customerId && <BillingPortalCard customerId={customerId} />}
      </If>

      <If condition={data}>
        {(data) => (
          <div className="flex w-full flex-col space-y-6">
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
