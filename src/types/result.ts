export type Result<T> = Ok<T> | Err;

export type Ok<T> = {
  tag: "ok";
  data: T;
};

export type Err = {
  tag: "err";
  message: string;
};

function ok<T>(data: T): Ok<T> {
  return {
    tag: "ok",
    data,
  };
}
function err(message: string): Err {
  return {
    tag: "err",
    message,
  };
}

export const result = {
  ok,
  err,
};

export function wrapThrowable<T>(
  throws: () => T,
  defaultMsg: string
): Result<T> {
  try {
    return ok(throws());
  } catch (e: any) {
    const message =
      "message" in e
        ? typeof e.message === "string"
          ? e.message
          : defaultMsg
        : defaultMsg;
    return err(message);
  }
}
