import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import CookieService from "lib/cookie";
import { sealOptions } from "utils/query";
import { NextApiRequestWithAuthorizationHeader } from "utils/types";
import { createServerError } from "utils/errors";
import { normalize } from "utils/string";
import { randomNumber } from "utils/randomNumber";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(database);

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

handler.post<NextApiRequestWithAuthorizationHeader, NextApiResponse>(
  async function login(req, res) {
    try {
      const didToken = req.headers.authorization.substr(7);
      magic.token.validate(didToken);

      const data = await magic.users.getMetadataByToken(didToken);
      let user = await models.User.findOne({ email: data.email });

      if (!user && data.email) {
        let userName = normalize(data.email.replace(/@.+/, ""));
        if (await models.User.findOne({ userName }))
          userName += "-" + randomNumber(2);

        user = await models.User.create({
          email: data.email,
          userName
        });
      }

      if (!user) throw new Error();

      const userToken = {
        email: data.email,
        isAdmin: user.isAdmin,
        userId: user._id,
        userName: user.userName
      };

      const token = await Iron.seal(userToken, process.env.SECRET, sealOptions);
      CookieService.setTokenCookie(res, token);

      res.status(200).json({ ...userToken, userImage: user.userImage });
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
