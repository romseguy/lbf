import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function check(req, res) {
  res.status(200).json({});
});

handler.post<NextApiRequest, NextApiResponse>(async function checkLoggedIn(
  req,
  res
) {
  try {
    const session = await getSession({ req });
    res.status(200).json(session);
  } catch (error) {
    console.log("POST /check error: ", error);
    res.status(401).json(createServerError(error));
  }
});

export default handler;
