import { normalize } from "./string";

export const belongs = (a?: string | string[], b?: string | string[]) => {
  if (!a || !b) return false;

  if (typeof a === "string") {
    a = normalize(a);

    if (typeof b === "string") {
      b = normalize(b);
      return a === b;
    }
    return b.map((str) => normalize(str)).includes(a);
  }

  if (typeof b === "string") {
    return a.map((str) => normalize(str)).includes(normalize(b));
  }

  return (
    a
      .map((str) => normalize(str))
      //@ts-expect-error
      .find((value) => b.map((str) => normalize(str)).includes(value))
  );
};
