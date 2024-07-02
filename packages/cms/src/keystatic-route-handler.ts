import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "./keystatic.config";

const handlers = makeRouteHandler({
  config,
});

/**
 * @name productionGuard
 * @description Guard for production environment. Returns 404 if in production.
 * @param routeHandler
 */
function productionGuard(routeHandler: (req: Request) => Promise<Response>) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  return (req: Request) => routeHandler(req);
}

/**
 * @name keystaticRouteHandlers
 * @description Route handlers for keystatic
 */
export const keystaticRouteHandlers = {
  POST: productionGuard(handlers.POST),
  GET: productionGuard(handlers.GET),
};
