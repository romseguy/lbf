import DOMPurify from "isomorphic-dompurify";
export * from "./base64ToUint8Array";
export * from "./capitalize";
export * from "./equals";
export * from "./formatStringToCamelCase";
export * from "./getStyleObjectFromString";
export * from "./normalize";

export const defaultErrorMessage =
  "Une erreur est survenue, merci de contacter le créateur de cet outil.";
export const phoneR = /^[0-9]{10,}$/i;

export function isImage(fileName: string) {
  return (
    fileName.includes(".png") ||
    fileName.includes(".jpg") ||
    fileName.includes(".jpeg") ||
    fileName.includes(".bmp") ||
    fileName.includes(".webp")
  );
}

export function logJson(message: string, object?: any) {
  if (object) console.log(message, JSON.stringify(object, null, 2));
  else console.log(message);
}

export function sanitize(str: string) {
  return DOMPurify.sanitize(str, {
    ADD_ATTR: ["target"],
    ADD_TAGS: ["iframe"]
  });
}

export function toString(a: any): string {
  if (typeof a === "object" && a.toString) return a.toString();

  return "" + a;
}

export function zIndex(level: number = 0) {
  const base = 10000;
  return level === 0 ? base : (level + 1) * base;
}
