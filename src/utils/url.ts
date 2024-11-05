export const urlR = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i;
export const optionalProtocolUrlR =
  /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/i;
export const unauthorizedEntityUrls = [
  "404",
  "a_propos",
  "admin",
  "b",
  "blog",
  "callback",
  "contact",
  "donate",
  "evenements",
  "index",
  "login",
  "logout",
  "organisations",
  "p",
  "privacy",
  "sandbox",
  "sent"
];
