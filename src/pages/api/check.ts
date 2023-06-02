import axios from "axios";
import https from "https";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { getSession } from "utils/auth";
import { createServerError } from "utils/errors";

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API2,
  responseType: "json",
  withCredentials: true,
  httpsAgent: agent
});

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(cors())
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    console.log("GET /check", `${process.env.NEXT_PUBLIC_API2}/check`);

    try {
      await client.get(`check`);
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
