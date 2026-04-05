import type { MiddlewareHandler } from "astro";
import connect from "./lib/connection";

export const onRequest: MiddlewareHandler = async (_, next) => {
  await connect();
  return next();
};
