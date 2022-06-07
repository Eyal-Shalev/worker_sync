import { assert } from "deno/testing/asserts.ts";
import { sleep } from "../internal/sleep.ts";
import { Semaphore } from "../semaphore.ts";

globalThis.onmessage = async (ev) => {
  try {
    assert(ev.data && Array.isArray(ev.data) && ev.data.length === 3);
    const [semData, n, loops] = ev.data;
    Semaphore.assertClone(semData);
    const sem = Semaphore.fromClone(semData);
    // console.log(globalThis.name, "A");
    for (let i = 0; i < loops; i++) {
      // console.log(globalThis.name, i, "start", Atomics.load(semData, 0));
      await sem.acquire(n, 1000);
      await sleep(Math.ceil(Math.random() * 100));
      sem.release(n);
      // console.log(globalThis.name, i, "end", Atomics.load(semData, 0));
    }
    // console.log(globalThis.name, "D");
    // console.log(globalThis.name, "done", Atomics.load(semData, 0));
    globalThis.postMessage(void 0);
  } catch (err) {
    console.error(globalThis.name, err);
    globalThis.postMessage(err);
  }
};
