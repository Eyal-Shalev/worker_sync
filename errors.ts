export class TimeoutError extends Error {
  override name = TimeoutError.name;
  constructor(message: string) {
    super(message);
  }
}

export class AssertionError extends Error {
  override name = AssertionError.name;
  constructor(message: string) {
    super(message);
  }
}
