import { cpus } from "os";
import { version } from "process";

export const navigator = {
  hardwareConcurrency: cpus().length,
  userAgent: `Node.js/${version}`,
  get gpu() {
    throw new Error("Not implemented");
  },
};
