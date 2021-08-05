export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}

export function getUniqueId(prefix?: string): string {
  const time = new Date().getTime() + Math.round(Math.random() * 100);
  return `${prefix || "uid-"}${time}`;
}
