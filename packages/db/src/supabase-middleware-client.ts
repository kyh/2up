import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import type { CookieOptions } from "@supabase/ssr";
import { getSupabaseClientKeys } from "./get-supabase-client-keys";

/**
 * Creates a middleware client for Supabase.
 *
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 */
export const createMiddlewareClient = <GenericSchema = Database>(
  request: NextRequest,
  response: NextResponse,
) => {
  const keys = getSupabaseClientKeys();

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookieStrategy(request, response),
  });
};

const getCookieStrategy = (request: NextRequest, response: NextResponse) => ({
  set: (name: string, value: string, options: CookieOptions) => {
    request.cookies.set({ name, value, ...options });

    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    response.cookies.set({
      name,
      value,
      ...options,
    });
  },
  get: (name: string) => {
    return request.cookies.get(name)?.value;
  },
  remove: (name: string, options: CookieOptions) => {
    request.cookies.set({
      name,
      value: "",
      ...options,
    });

    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    response.cookies.set({
      name,
      value: "",
      ...options,
    });
  },
});
