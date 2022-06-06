import { sleep } from "../internal/sleep.ts";
import { Semaphore } from "../semaphore.ts";

self.onmessage = async (ev) => {
  try {
    const [semData] = ev.data;
    Semaphore.assertClone(semData);
    const sem = Semaphore.fromClone(semData);

    await sem.acquire(1);
    await sleep(100);
    sem.release();

    self.postMessage(void 0);
  } catch (err) {
    console.error(self.name, err);
    self.postMessage(err);
  }
};
