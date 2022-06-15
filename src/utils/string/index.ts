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

export function bytesForHuman(bytes: number, decimals = 0) {
  const units = ["o", "Ko", "Mo", "Go"];
  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return parseFloat(bytes.toFixed(decimals)) + units[i];
}

export function transformRTEditorOutput(
  str: string,
  isMobile: boolean
): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str.replace(/\n/g, ""), "text/html");
  const links = (doc.firstChild as HTMLElement).getElementsByTagName("a");

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.setAttribute("title", link.innerText);

    if (
      isMobile &&
      (link.href.includes("http") || link.href.includes("mailto:"))
    ) {
      link.classList.add("clip");

      if (link.href.includes("mailto:")) link.innerText = "@" + link.innerText;
    }
  }

  return doc;
}

export function isImage(fileName: string) {
  const str = fileName.toLowerCase();
  return (
    str.includes(".png") ||
    str.includes(".jpg") ||
    str.includes(".jpeg") ||
    str.includes(".bmp") ||
    str.includes(".webp")
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
