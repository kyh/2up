import type { NextRequest } from "next/server";
import { NextResponse, URLPattern } from "next/server";
import { createMiddlewareClient } from "@repo/db/supabase-middleware-client";

const NEXT_ACTION_HEADER = "next-action";

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|locales|assets|api/*).*)"],
};

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next({ request });

  // set a unique request ID for each request
  // this helps us log and trace requests
  request.headers.set("x-correlation-id", crypto.randomUUID());

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(request.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, response);

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // append the action path to the request headers
  // which is useful for knowing the action path in server actions
  if (isServerAction(request)) {
    response.headers.set("x-action-path", request.nextUrl.pathname);
  }

  // if no pattern handler returned a response,
  // return the session response
  return response;
};

const isServerAction = (request: NextRequest) => {
  const headers = new Headers(request.headers);

  return headers.has(NEXT_ACTION_HEADER);
};

/**
 * Define URL patterns and their corresponding handlers.
 */
const getPatterns = () => [
  {
    pattern: new URLPattern({ pathname: "/admin/*?" }),
    handler: async (request: NextRequest, response: NextResponse) => {
      const supabase = createMiddlewareClient(request, response);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // If user is not logged in, redirect to sign in page.
      // This should never happen, but just in case.
      if (!user || error) {
        return NextResponse.redirect(
          new URL("/auth/sign-in", request.nextUrl.origin).href,
        );
      }

      const role = user.user_metadata.role;

      // If user is not an admin, redirect to 404 page.
      if (!role || role !== "super-admin") {
        return NextResponse.redirect(
          new URL("/404", request.nextUrl.origin).href,
        );
      }

      // in all other cases, return the response
      return response;
    },
  },
  {
    pattern: new URLPattern({ pathname: "/auth/*?" }),
    handler: async (request: NextRequest, response: NextResponse) => {
      const supabase = createMiddlewareClient(request, response);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // the user is logged out, so we don't need to do anything
      if (!user || error) {
        return;
      }

      // check if we need to verify MFA (user is authenticated but needs to verify MFA)
      const isVerifyMfa = request.nextUrl.pathname === "/auth/verify";

      // If user is logged in and does not need to verify MFA,
      // redirect to home page.
      if (!isVerifyMfa) {
        return NextResponse.redirect(
          new URL("/dashboard", request.nextUrl.origin).href,
        );
      }
    },
  },
];

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
const matchUrlPattern = (url: string) => {
  const patterns = getPatterns();
  const input = url.split("?")[0];

  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);

    if (patternResult !== null && "pathname" in patternResult) {
      return pattern.handler;
    }
  }
};
