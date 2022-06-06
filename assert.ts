import { AssertionError } from "./errors.ts";
export { AssertionError };

export function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) throw new AssertionError(msg);
}
