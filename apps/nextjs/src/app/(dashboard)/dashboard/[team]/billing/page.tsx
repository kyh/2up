import { If } from "@init/ui/if";

import { PageHeader } from "@/components/header";
import { billingConfig } from "@/lib/billing-config";
import { api } from "@/trpc/server";
import { BillingPortalCard } from "./_components/billing-portal-card";
import { CheckoutForm } from "./_components/checkout-form";
import { CurrentLifetimeOrderCard } from "./_components/current-lifetime-order-card";
import { CurrentSubscriptionCard } from "./_components/current-subscription-card";

const Page = async () => {
  const { user } = await api.account.userWorkspace();

  const [subscription, customerId] = await Promise.all([
    api.billing.getSubscription({ accountId: user.id }),
    api.billing.getCustomerId({ accountId: user.id }),
  ]);

  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Billing</PageHeader>
      <section>
        <If condition={!subscription}>
          <CheckoutForm
            userId={user.id}
            userEmail={user.email}
            customerId={customerId}
          />
          {customerId && <BillingPortalCard customerId={customerId} />}
        </If>
        <If condition={subscription}>
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
    </main>
  );
};

export default Page;
