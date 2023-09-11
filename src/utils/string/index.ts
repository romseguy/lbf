import DOMPurify from "isomorphic-dompurify";
export * from "./base64ToUint8Array";
export * from "./capitalize";
export * from "./equals";
export * from "./formatStringToCamelCase";
export * from "./getStyleObjectFromString";
export * from "./normalize";

export const defaultErrorMessage =
  "Une erreur est survenue, merci de laisser un message sur le forum.";
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

    if (!link.innerText.includes("http")) {
      link.setAttribute("title", link.innerText);

      if (
        isMobile &&
        (link.href.includes("http") || link.href.includes("mailto:"))
      ) {
        link.classList.add("clip");

        if (link.href.includes("mailto:"))
          link.innerText = "@" + link.innerText;
      }
    }
  }

  return doc;
}

export function transformTopicMessage(str: string) {
  if (!str) return "<i>Message vide.</i>";

  let newStr = "" + str;

  if (str.includes("href")) {
    const collapseLength = 28;
    const regex =
      /([^+>]*)[^<]*(<a [^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/gi;
    let link;
    while ((link = regex.exec(str)) !== null) {
      // const url = link[4];
      const text = link[5];
      let canCollapse = text.length > collapseLength;
      if (canCollapse) {
        const shortText = "Ouvrir le lien";
        newStr = newStr.replace(">" + text + "<", ">" + shortText + "<");
      }
    }
  }

  return newStr;
}

export function getExtension(path: string) {
  // extract file name from full path ...
  // (supports `\\` and `/` separators)
  const basename = path.split(/[\\/]/).pop();

  if (!basename) return "";

  // get last position of `.`
  const pos = basename.lastIndexOf(".");

  if (pos < 1) return "";

  // extract extension ignoring `.`
  return basename.slice(pos + 1).toLowerCase();
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

export function sanitize(str?: string) {
  if (!str) return "";
  return DOMPurify.sanitize(str, {
    ADD_ATTR: ["target"],
    ADD_TAGS: ["iframe"]
  });
}

export function toLowerCase(str?: string) {
  if (!str) return "";

  return str.toLowerCase();
}

export function toString(a: any): string {
  if (typeof a === "object" && a.toString) return a.toString();

  return "" + a;
}

export function zIndex(level: number = 0) {
  const base = 10000;
  return level === 0 ? base : (level + 1) * base;
}
