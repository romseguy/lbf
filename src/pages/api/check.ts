import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database from "database";
import Iron from "@hapi/iron";
import CookieService from "lib/cookie";
import { createServerError } from "utils/errors";

const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function check(req, res) {
  res.status(200).json({});
});

handler.post<NextApiRequest, NextApiResponse>(async function checkLoggedIn(
  req,
  res
) {
  let user;

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.SECRET,
      sealOptions
    );

    // now we have access to the data inside of user
    // and we could make database calls or just send back what we have
    // in the token.
    res.status(200).json(user);
  } catch (error) {
    console.log("POST /check error: ", error);
    res.status(401).json(createServerError(error));
  }
});

export default handler;
