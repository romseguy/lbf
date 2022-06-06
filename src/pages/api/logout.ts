import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database from "database";
import CookieService from "lib/cookie";
import { createServerError } from "utils/errors";
import { NextApiRequestWithAuthorizationHeader } from "utils/types";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(database);
handler.get<NextApiRequestWithAuthorizationHeader, NextApiResponse>(
  async function logout(req, res) {
    try {
      CookieService.setTokenCookie(res, "");
      res.status(200).json({});
    } catch (error: any) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
