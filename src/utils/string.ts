import { Types } from "mongoose";

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}

export function getUniqueId(prefix?: string): string {
  const time = new Date().getTime() + Math.round(Math.random() * 100);
  return `${prefix || "uid-"}${time}`;
}

export function normalize(str: string, underscores?: boolean): string {
  if (underscores) str = str.replace(/\ /g, "_");

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
