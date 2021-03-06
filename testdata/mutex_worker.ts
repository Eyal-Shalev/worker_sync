import { assert, assertEquals } from "deno/testing/asserts.ts";
import { Mutex } from "../mutext.ts";

globalThis.onmessage = async (ev) => {
  try {
    assert(ev.data && Array.isArray(ev.data) && ev.data.length === 2);
    const [semData, counter] = ev.data;
    Mutex.assertClone(semData);
    const m = Mutex.fromClone(semData);
    await m.lock();
    assertEquals(Atomics.compareExchange(counter, 0, 1, 2), 1);
    m.unlock();
    globalThis.postMessage(void 0);
  } catch (err) {
    globalThis.postMessage(err);
  }
};
