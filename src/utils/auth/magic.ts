import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { SDKBase, InstanceWithExtensions } from "@magic-sdk/provider";

const createMagic = (key: string) => {
  return (
    typeof window != "undefined" &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
      locale: "fr"
    })
  );
};

// client-side Magic instance
export const magic = createMagic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
) as InstanceWithExtensions<SDKBase, OAuthExtension[]>;
