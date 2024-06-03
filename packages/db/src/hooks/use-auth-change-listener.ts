"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSupabase } from "./use-supabase";
import { useRevalidateUserSession, useUserSession } from "./use-user-session";

/**
 * @name PRIVATE_PATH_PREFIXES
 * @description A list of private path prefixes
 */
const PRIVATE_PATH_PREFIXES = ["/home", "/admin", "/join", "/update-password"];

/**
 * @name useAuthChangeListener
 * @param privatePathPrefixes
 * @param appHomePath
 */
export const useAuthChangeListener = ({
  privatePathPrefixes = PRIVATE_PATH_PREFIXES,
  appHomePath,
}: {
  appHomePath: string;
  privatePathPrefixes?: string[];
}) => {
  const client = useSupabase();
  const pathName = usePathname();
  const router = useRouter();
  const revalidateUserSession = useRevalidateUserSession();
  const session = useUserSession();
  const accessToken = session.data?.access_token;

  useEffect(() => {
    // keep this running for the whole session unless the component was unmounted
    const listener = client.auth.onAuthStateChange((event, user) => {
      // log user out if user is falsy
      // and if the current path is a private route
      const shouldRedirectUser =
        !user && isPrivateRoute(pathName, privatePathPrefixes);

      if (shouldRedirectUser) {
        // send user away when signed out
        window.location.assign("/");

        return;
      }

      if (event === "SIGNED_OUT") {
        return router.refresh();
      }

      if (accessToken) {
        const isOutOfSync = user?.access_token !== accessToken;

        if (isOutOfSync) {
          void router.refresh();
        }
      }
    });

    // destroy listener on un-mounts
    return () => listener.data.subscription.unsubscribe();
  }, [
    client.auth,
    router,
    accessToken,
    revalidateUserSession,
    pathName,
    appHomePath,
    privatePathPrefixes,
  ]);
};

/**
 * Determines if a given path is a private route.
 */
const isPrivateRoute = (path: string, privatePathPrefixes: string[]) =>
  privatePathPrefixes.some((prefix) => path.startsWith(prefix));
