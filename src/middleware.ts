import type { MiddlewareHandler } from "astro";
import connect from "./lib/connection";

// Connect once at the middleware layer so API routes can assume Mongoose is ready.
export const onRequest: MiddlewareHandler = async (_, next) => {
  await connect();
  return next();
};
