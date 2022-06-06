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
      const user = await models.User.findOne({ email: data.email });

      console.log("POST /login user from DB: ", user);

      let userToken;

      if (user) {
        userToken = {
          email: data.email,
          userId: user._id,
          userImage: user.userImage,
          userName: user.userName,
          isAdmin: user.isAdmin
        };
      } else if (data.email) {
        let userName = normalize(data.email.replace(/@.+/, ""));
        if (await models.User.findOne({ userName }))
          userName += "-" + randomNumber(2);

        const user = await models.User.create({
          email: data.email,
          userName
        });

        userToken = {
          email: data.email,
          userId: user._id,
          userName
        };
      }

      const token = await Iron.seal(userToken, process.env.SECRET, sealOptions);
      CookieService.setTokenCookie(res, token);

      //res.status(200).json({ authenticated: true });
      res.status(200).json(userToken);
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
