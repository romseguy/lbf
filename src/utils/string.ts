import { Types } from "mongoose";

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}

export function getUniqueId(prefix?: string): string {
  const time = new Date().getTime() + Math.round(Math.random() * 100);
  return `${prefix || "uid-"}${time}`;
}

export function normalize(str: string, underscores?: boolean): string {
  // if (underscores)
  str = str.replace(/\ /g, "_");

  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function equals(a: any, b: any): boolean {
  if (typeof a === "string" && typeof b === "string") a === b;

  let aa = a;
  let bb = b;

  if (typeof a === "object" && a.toString) aa = a.toString();
  if (typeof b === "object" && b.toString) bb = b.toString();

  return aa === bb;
}

export function toString(a: any): string {
  if (typeof a === "object" && a.toString) return a.toString();

  return "" + a;
}

const formatStringToCamelCase = (str: string) => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

export const getStyleObjectFromString = (str: string) => {
  const style: { [key: string]: string } = {};
  str.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    console.log(property, value);

    if (!property || !value) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};

export const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
