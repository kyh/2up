import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { BlurryBackdrop } from "@init/ui/blurry-backdrop";

import { api } from "@/trpc/server";
import { BillingSessionStatus } from "../_components/billing-session-status";

interface SessionPageProps {
  searchParams: {
    session_id: string;
  };
}

const LazyEmbeddedCheckout = dynamic(
  async () => {
    const { EmbeddedCheckout } = await import(
      "../_components/embedded-checkout"
    );

    return EmbeddedCheckout;
  },
  {
    ssr: false,
  },
);

async function Page({ searchParams }: SessionPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect("../");
  }

  const { customerEmail, checkoutToken } = await loadCheckoutSession(sessionId);

  if (checkoutToken) {
    return <LazyEmbeddedCheckout checkoutToken={checkoutToken} />;
  }

  return (
    <>
      <div className={"fixed left-0 top-48 z-50 mx-auto w-full"}>
        <BillingSessionStatus
          onRedirect={onRedirect}
          customerEmail={customerEmail ?? ""}
        />
      </div>

      <BlurryBackdrop />
    </>
  );
}

export default Page;

async function loadCheckoutSession(sessionId: string) {
  const session = await api.billing.retrieveCheckoutSession({
    sessionId,
  });

  if (!session) {
    notFound();
  }

  const checkoutToken = session.isSessionOpen ? session.checkoutToken : null;

  // otherwise - we show the user the return page
  // and display the details of the session
  return {
    status: session.status,
    customerEmail: session.customer.email,
    checkoutToken,
  };
}

/**
 * Revalidates the layout to update cached pages
 * and redirects back to the home page.
 */
// eslint-disable-next-line @typescript-eslint/require-await
async function onRedirect() {
  "use server";

  // redirect back to billing page
  redirect("../billing");
}
