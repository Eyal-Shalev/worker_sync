export interface Clonable<T> {
  clone(): T;
}
export interface ClonableConstructor<T> {
  fromClone(_: T): Clonable<T>;
  isClone(data: unknown): data is T;
  assertClone(data: unknown): asserts data is T;
}
