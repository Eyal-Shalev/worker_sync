import { assert } from "deno/testing/asserts.ts";
import { sleep } from "../internal/sleep.ts";
import { Mutex } from "../mutext.ts";

self.onmessage = async (ev) => {
  try {
    assert(ev.data && Array.isArray(ev.data) && ev.data.length === 2);
    const [semData, loops] = ev.data;
    Mutex.assertClone(semData);
    const m = Mutex.fromClone(semData);
    for (let i = 0; i < loops; i++) {
      await m.lock();
      await sleep(Math.round(Math.random() * 10));
      m.unlock();
    }
    self.postMessage(void 0);
  } catch (err) {
    self.postMessage(err);
  }
};
