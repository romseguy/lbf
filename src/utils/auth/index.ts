import Iron from "@hapi/iron";

export * from "./cookie";
export * from "./magic";
export * from "./session";

export const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};
