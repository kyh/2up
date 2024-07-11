import { forwardRef, lazy, memo, Suspense, useMemo } from "react";
import { BlurryBackdrop } from "@init/ui/blurry-backdrop";
import { Spinner } from "@init/ui/spinner";

const Fallback = (
  <div className="flex flex-col items-center justify-center p-4">
    <Spinner />
  </div>
);

export const EmbeddedCheckout = (
  props: React.PropsWithChildren<{
    checkoutToken: string;
    onClose?: () => void;
  }>,
) => {
  const CheckoutComponent = useMemo(() => loadCheckoutComponent(), []);

  return (
    <>
      <CheckoutComponent
        onClose={props.onClose}
        checkoutToken={props.checkoutToken}
      />

      <BlurryBackdrop />
    </>
  );
};

const loadCheckoutComponent = () =>
  buildLazyComponent(() => {
    return import("./stripe-embedded-checkout").then(({ StripeCheckout }) => {
      return {
        default: StripeCheckout,
      };
    });
  });

const buildLazyComponent = <
  Component extends React.ComponentType<{
    onClose: (() => unknown) | undefined;
    checkoutToken: string;
  }>,
>(
  load: () => Promise<{
    default: Component;
  }>,
  fallback = Fallback,
) => {
  let LoadedComponent: ReturnType<typeof lazy<Component>> | null = null;

  const LazyComponent = forwardRef<
    React.ElementRef<"div">,
    {
      onClose: (() => unknown) | undefined;
      checkoutToken: string;
    }
  >((props, ref) => {
    if (!LoadedComponent) {
      LoadedComponent = lazy(load);
    }

    return (
      <Suspense fallback={fallback}>
        {/* @ts-expect-error: weird TS */}
        <LoadedComponent
          onClose={props.onClose}
          checkoutToken={props.checkoutToken}
          ref={ref}
        />
      </Suspense>
    );
  });

  return memo(LazyComponent);
};
