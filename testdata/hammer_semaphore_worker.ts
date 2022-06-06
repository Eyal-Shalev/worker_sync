import { assert } from "deno/testing/asserts.ts";
import { sleep } from "../internal/sleep.ts";
import { Semaphore } from "../semaphore.ts";

self.onmessage = async (ev) => {
  try {
    assert(ev.data && Array.isArray(ev.data) && ev.data.length === 3);
    const [semData, n, loops] = ev.data;
    Semaphore.assertClone(semData);
    const sem = Semaphore.fromClone(semData);
    // console.log(self.name, "A");
    for (let i = 0; i < loops; i++) {
      // console.log(self.name, i, "start", Atomics.load(semData, 0));
      await sem.acquire(n, 1000);
      await sleep(Math.ceil(Math.random() * 100));
      sem.release(n);
      // console.log(self.name, i, "end", Atomics.load(semData, 0));
    }
    // console.log(self.name, "D");
    // console.log(self.name, "done", Atomics.load(semData, 0));
    self.postMessage(void 0);
  } catch (err) {
    console.error(self.name, err);
    self.postMessage(err);
  }
};
