import { seal } from "@hapi/iron";
import { Magic } from "@magic-sdk/admin";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { getCurrentId } from "store/utils";
import { setTokenCookie, sealOptions } from "utils/auth";
import { createServerError } from "utils/errors";
import { normalize } from "utils/string";
import { NextApiRequestWithAuthorizationHeader } from "utils/types";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(database);

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

handler.get<NextApiRequestWithAuthorizationHeader, NextApiResponse>(
  async function login(req, res) {
    try {
      const didToken = req.headers.authorization.substr(7);
      magic.token.validate(didToken);
      const data = await magic.users.getMetadataByToken(didToken);

      let user = await models.User.findOne({ email: data.email });
      if (!user && data.email) {
        let userName = normalize(data.email.replace(/@.+/, ""));

        if (
          (await models.Event.findOne({ eventUrl: userName })) ||
          (await models.Org.findOne({ orgUrl: userName })) ||
          (await models.User.findOne({ userName }))
        ) {
          const uid = (await getCurrentId()) + 1;
          userName = userName + "-" + uid;
        }

        user = await models.User.create({
          email: data.email,
          userName
        });
      }
      if (!user) throw new Error();

      const userToken = {
        email: data.email,
        userId: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin
      };

      const token = await seal(userToken, process.env.SECRET, sealOptions);
      setTokenCookie(res, token);

      res.status(200).json({ authenticated: true });
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
