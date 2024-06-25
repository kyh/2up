import { notFound } from "next/navigation";

import { api } from "@/trpc/server";

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

/**
 * AdminGuard is a server component wrapper that checks if the user is a super-admin before rendering the component.
 * If the user is not a super-admin, we redirect to a 404.
 * @param Component - The Page or Layout component to wrap
 */
export function AdminGuard<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function AdminGuardServerComponentWrapper(params: Params) {
    const user = await api.account.me();

    // if the user is not a super-admin, we redirect to a 404
    if (!user || user.app_metadata?.role !== "super-admin") {
      notFound();
    }

    return <Component {...params} />;
  };
}
