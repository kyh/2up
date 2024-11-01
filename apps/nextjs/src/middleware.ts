import type { NextRequest } from "next/server";
import { NextResponse, URLPattern } from "next/server";
import { createCsrfProtect, CsrfError } from "@edge-csrf/nextjs";
import { checkRequiresMultiFactorAuthentication } from "@init/api/auth/check-requires-mfa";
import { createMiddlewareClient } from "@init/db/supabase-middleware-client";

const CSRF_SECRET_COOKIE = "csrfSecret";
const NEXT_ACTION_HEADER = "next-action";

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|locales|assets|api/*).*)"],
};

const getUser = (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient(request, response);

  return supabase.auth.getUser();
};

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next({ request });

  // set a unique request ID for each request
  // this helps us log and trace requests
  request.headers.set("x-correlation-id", crypto.randomUUID());

  // apply CSRF protection for mutating requests
  const csrfResponse = await withCsrfMiddleware(request, response);

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(request.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, csrfResponse);

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // append the action path to the request headers
  // which is useful for knowing the action path in server actions
  if (isServerAction(request)) {
    csrfResponse.headers.set("x-action-path", request.nextUrl.pathname);
  }

  // if no pattern handler returned a response,
  // return the session response
  return csrfResponse;
};

const withCsrfMiddleware = async (
  request: NextRequest,
  response: NextResponse,
) => {
  // set up CSRF protection
  const csrfProtect = createCsrfProtect({
    cookie: {
      secure: process.env.NODE_ENV === "production",
      name: CSRF_SECRET_COOKIE,
    },
    // ignore CSRF errors for server actions since protection is built-in
    ignoreMethods: isServerAction(request)
      ? ["POST"]
      : // always ignore GET, HEAD, and OPTIONS requests
        ["GET", "HEAD", "OPTIONS"],
  });

  try {
    await csrfProtect(request, response);

    return response;
  } catch (error) {
    // if there is a CSRF error, return a 403 response
    if (error instanceof CsrfError) {
      return NextResponse.json("Invalid CSRF token", {
        status: 401,
      });
    }

    throw error;
  }
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
      const {
        data: { user },
        error,
      } = await getUser(request, response);

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
    handler: async (req: NextRequest, res: NextResponse) => {
      const {
        data: { user },
      } = await getUser(req, res);

      // the user is logged out, so we don't need to do anything
      if (!user) {
        return;
      }

      // check if we need to verify MFA (user is authenticated but needs to verify MFA)
      const isVerifyMfa = req.nextUrl.pathname === "/auth/verify";

      // If user is logged in and does not need to verify MFA,
      // redirect to home page.
      if (!isVerifyMfa) {
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl.origin).href,
        );
      }
    },
  },
  {
    pattern: new URLPattern({ pathname: "/dashboard/*?" }),
    handler: async (req: NextRequest, res: NextResponse) => {
      const {
        data: { user },
      } = await getUser(req, res);

      const origin = req.nextUrl.origin;
      const next = req.nextUrl.pathname;

      // If user is not logged in, redirect to sign in page.
      if (!user) {
        const signIn = "/auth/sign-in";
        const redirectPath = `${signIn}?next=${next}`;

        return NextResponse.redirect(new URL(redirectPath, origin).href);
      }

      const supabase = createMiddlewareClient(req, res);

      const requiresMultiFactorAuthentication =
        await checkRequiresMultiFactorAuthentication(supabase);

      // If user requires multi-factor authentication, redirect to MFA page.
      if (requiresMultiFactorAuthentication) {
        return NextResponse.redirect(new URL("/auth/verify", origin).href);
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
