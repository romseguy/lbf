import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import CookieService from "lib/cookie";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);
const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};

export default async function login(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const didToken = req.headers.authorization.substr(7);
    magic.token.validate(didToken);

    const user = await magic.users.getMetadataByToken(didToken);
    const token = await Iron.seal(user, process.env.SECRET, sealOptions);
    CookieService.setTokenCookie(res, token);

    res.status(200).json({ authenticated: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
