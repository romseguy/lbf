import DOMPurify from "isomorphic-dompurify";

function formatStringToCamelCase(str: string) {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
}

export function base64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}

export const defaultErrorMessage =
  "Une erreur est survenue, merci de contacter le créateur de cet outil.";

export function equals(a: any, b: any): boolean {
  const eq = equalsValue(a, b);
  if (eq) return eq;

  let aa = a;
  let bb = b;

  if (typeof a === "object" && a.toString) aa = a.toString();
  if (typeof b === "object" && b.toString) bb = b.toString();

  return aa === bb;
}

export function equalsValue(a: string | undefined, b: string | undefined) {
  return typeof a === "string" && typeof b === "string" && a === b;
}

export function getStyleObjectFromString(str: string) {
  const style: { [key: string]: string } = {};
  str.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    console.log(property, value);

    if (!property || !value) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
}

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

export function normalize(str: string, underscores?: boolean): string {
  str = str.trim();
  str = str.replace(/\//g, "");
  str = str.replace(/\s{2,}/g, " ");

  if (typeof underscores === "undefined" || !!underscores)
    str = str.replace(/\ /g, "_");

  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export const phoneR = /^[0-9]{10,}$/i;

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
