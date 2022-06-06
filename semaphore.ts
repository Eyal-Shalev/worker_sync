import { Clonable, ClonableConstructor } from "./internal/clonable.ts";
import { assert } from "./assert.ts";
import { staticImplements } from "./internal/staticImplements.ts";
import { TimeoutError } from "./errors.ts";

@staticImplements<ClonableConstructor<Int32Array>>()
export class Semaphore implements Clonable<Int32Array> {
  #arr: Int32Array;

  constructor(arr: Int32Array) {
    this.#arr = Object.seal(arr);
  }

  public acquire(amount = 1, timeout = Infinity) {
    return new Promise<void>((res, rej) => {
      try {
        assert(
          Number.isSafeInteger(amount) && amount > 0,
          "amount should be a safe & positive integer",
        );
        assert(
          timeout === Infinity ||
            (Number.isSafeInteger(timeout) && timeout > 0),
          "timeout should either be Infinity or a positive safe integer",
        );
        const end = Math.ceil(performance.now() + timeout);

        while (true) {
          const cur = Atomics.load(this.#arr, 0);

          // If there are not enogh resources in this semaphore, wait until the current count changes and try again.
          if (cur < amount) {
            const curTimeout = Math.ceil(end - performance.now());
            if (curTimeout <= 0) {
              throw new TimeoutError("failed to acquire semaphore");
            }
            const value = Atomics.wait(this.#arr, 0, cur, curTimeout);
            if (value === "timed-out") {
              throw new TimeoutError("failed to acquire semaphore");
            }
            continue;
          }

          const actual = Atomics.compareExchange(
            this.#arr,
            0,
            cur,
            cur - amount,
          );
          if (actual !== cur) {
            continue;
          }

          Atomics.notify(this.#arr, 0);
          break;
        }
        res();
      } catch (err) {
        rej(err);
      }
    });
  }

  public release(amount = 1) {
    assert(
      Number.isSafeInteger(amount) && amount > 0,
      "amount should be a safe & positive integer",
    );

    let cur, actual;

    while (true) {
      cur = Atomics.load(this.#arr, 0);
      actual = Atomics.compareExchange(this.#arr, 0, cur, cur + amount);
      if (actual === cur) break;
    }

    Atomics.notify(this.#arr, 0);
  }

  public static create(n: number) {
    const sem = new Semaphore(
      new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),
    );
    sem.release(n);
    return sem;
  }

  clone(): Int32Array {
    return this.#arr;
  }

  public static fromClone(data: Int32Array): Semaphore {
    assert(data.length === 1, `${Semaphore.name} array length must equal 1`);
    return new Semaphore(data);
  }
  public static isClone(data: unknown): data is Int32Array {
    return data instanceof Int32Array;
  }

  public static assertClone(data: unknown): asserts data is Int32Array {
    assert(Semaphore.isClone(data));
  }
}
