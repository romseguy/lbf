import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { getSession } from "utils/auth";
import { createServerError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(cors())
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    try {
      await axios.get("https://api.lekoala.org/check");
      res.status(200).json({});
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  })
  .post<NextApiRequest, NextApiResponse>(async function checkLoggedIn(
    req,
    res
  ) {
    try {
      const session = await getSession({ req });
      res.status(200).json(session);
    } catch (error) {
      console.error("POST /check error: ", error);
      res.status(401).json(createServerError(error));
    }
  });

export default handler;
