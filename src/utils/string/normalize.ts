export function normalize(str: string, underscores?: boolean): string {
  let out = "" + str.trim();
  out = out.replace(/\//g, "");
  out = out.replace(/\s{2,}/g, " ");

  if (underscores) out = out.replace(/\ /g, "_");

  out = out.normalize("NFD");
  //out = out.replace(/\p{Diacritic}/gu, "");  // TypeError: s.clone is not a function
  out = out.toLowerCase();

  return out;
}
