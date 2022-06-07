import { Semaphore } from "./semaphore.ts";
import { assert, assertEquals } from "deno/testing/asserts.ts";
import { sleep } from "./internal/sleep.ts";
import { isDeno } from "which_runtime";
import "./testdata/hammer_semaphore_worker.ts";

Deno.test(async function acquire(t) {
  const n = 100;
  const sem = Semaphore.create(n);
  await t.step({
    name: "successWhenAvailable",
    fn: async () => {
      await Promise.all(Array(n).fill(void 0).map(() => sem.acquire()));
    },
  });
  await t.step({
    name: "failWhenEmpty",
    fn: async () => {
      const resultsP = Promise.allSettled(
        Array(n).fill(void 0).map(() => sem.acquire(1, 10)),
      );
      const timeoutP = sleep(15);
      const results = await Promise.race([resultsP, timeoutP]);
      assert(results, "acquire took too long to fail");
      assertEquals(
        results.filter((res) => res.status === "fulfilled").length,
        0,
      );
      await timeoutP;
    },
  });
});

Deno.test(async function hammerSemaphore() {
  const n = navigator.hardwareConcurrency;
  const loops = 16 / n;
  const sem = Semaphore.create(n);

  const results = await Promise.allSettled(
    Array(n).fill(void 0).map((_, i) => {
      const name = `${hammerSemaphore.name}:worker#${i}`;
      const w = new Worker(
        new URL(
          isDeno
            ? "testdata/hammer_semaphore_worker.ts"
            : "testdata/hammer_semaphore_worker.js",
          import.meta.url,
        ),
        { type: "module", name },
      );
      return new Promise<void>((res, rej) => {
        w.onmessage = (ev) => {
          const err = ev.data;
          if (!err) {
            res();
          } else {
            rej(err);
          }
        };
        w.postMessage([sem.clone(), i + 1, loops]);
      }).finally(() => w.terminate());
    }),
  );
  const failures = results.filter((result) =>
    result.status === "rejected"
  ) as PromiseRejectedResult[];
  failures.forEach((failure) => console.error(failure.reason));
  assertEquals(failures.length, 0);
});
