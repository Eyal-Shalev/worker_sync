import { assertEquals } from "deno/testing/asserts.ts";
import { Mutex } from "./mutext.ts";
import { sleep } from "./internal/sleep.ts";
import { isDeno } from "which_runtime";
import "./testdata/mutex_worker.ts";
import "./testdata/hammer_mutex_worker.ts";

Deno.test(async function counter() {
  const counter = new Uint8Array(
    new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT),
  );
  const m = Mutex.create();

  const w = new Worker(
    new URL(
      isDeno ? "testdata/mutex_worker.ts" : "testdata/mutex_worker.js",
      import.meta.url,
    ),
    { type: "module" },
  );
  const p = new Promise<void>((res, rej) => {
    w.onmessage = (ev) => {
      const err = ev.data;
      if (!err) res();
      else rej(err);
    };
  }).finally(() => w.terminate());

  await m.lock();
  assertEquals(Atomics.compareExchange(counter, 0, 0, 1), 0);
  w.postMessage([m.clone(), counter]);

  m.unlock();

  await sleep(isDeno ? 10 : 200); // Give the worker time to take the lock.
  await m.lock();
  assertEquals(Atomics.compareExchange(counter, 0, 2, 3), 2);
  m.unlock();

  await p;
});

Deno.test(async function hammerMutex() {
  const n = navigator.hardwareConcurrency;
  const loops = 100 / n;
  const m = Mutex.create();

  const results = await Promise.allSettled(
    Array(n).fill(void 0).map((_, i) =>
      new Promise<void>((res, rej) => {
        const w = new Worker(
          new URL(
            isDeno
              ? "testdata/hammer_mutex_worker.ts"
              : "testdata/hammer_mutex_worker.js",
            import.meta.url,
          ),
          { type: "module", name: i.toString() },
        );
        w.onmessage = (ev) => {
          w.terminate();
          const err = ev.data;
          if (!err) res();
          else rej(err);
        };
        w.postMessage([m.clone(), loops]);
      })
    ),
  );
  const failures = results.filter((result) =>
    result.status === "rejected"
  ) as PromiseRejectedResult[];
  failures.forEach((failure) => console.error(failure.reason));
  assertEquals(failures.length, 0);
});
