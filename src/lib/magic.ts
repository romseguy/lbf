import { OAuthProvider } from "@magic-ext/oauth";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { SDKBase, InstanceWithExtensions } from "@magic-sdk/provider";

// Create client-side Magic instance
const createMagic = (key: string) => {
  return (
    typeof window != "undefined" &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
      locale: "fr"
    })
  );
};

export const magic = createMagic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
) as InstanceWithExtensions<SDKBase, OAuthExtension[]>;

export async function handleLoginWithSocial(provider: OAuthProvider) {
  await magic.oauth.loginWithRedirect({
    provider,
    redirectURI: new URL("/callback", window.location.origin).href
  });
}
