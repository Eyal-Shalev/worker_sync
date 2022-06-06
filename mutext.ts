import { Clonable, ClonableConstructor } from "./internal/clonable.ts";
import { staticImplements } from "./internal/staticImplements.ts";
import { Semaphore } from "./semaphore.ts";

@staticImplements<ClonableConstructor<Int32Array>>()
export class Mutex implements Clonable<Int32Array> {
  #sem: Semaphore;

  private constructor(sem: Semaphore) {
    this.#sem = sem;
  }

  lock() {
    return this.#sem.acquire();
  }

  unlock() {
    return this.#sem.release();
  }

  clone(): Int32Array {
    return this.#sem.clone();
  }

  public static create() {
    return new Mutex(Semaphore.create(1));
  }
  public static fromClone(data: Int32Array): Mutex {
    return new Mutex(Semaphore.fromClone(data));
  }
  public static isClone(data: unknown): data is Int32Array {
    return data instanceof Int32Array;
  }
  public static assertClone(data: unknown): asserts data is Int32Array {
    Semaphore.assertClone(data);
  }
}
