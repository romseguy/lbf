export function normalize(
  str: string,
  underscores: boolean | undefined = true
): string {
  let out = "" + str.trim();
  out = out.replace(/\//g, "");
  out = out.replace(/\s{2,}/g, " ");

  if (underscores) out = out.replace(/\ /g, "_");

  out = out.normalize("NFKD").replace(/[^\w\s.-_\/\']/g, "");
  //out = out.replace(/\p{Diacritic}/gu, "");
  out = out.toLowerCase();

  return out;
}
