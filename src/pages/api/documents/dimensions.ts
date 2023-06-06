import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createServerError } from "utils/errors";
import { objectToQueryString } from "utils/query";

import https from "https";
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
  .get<NextApiRequest, NextApiResponse>(async function dimensions(req, res) {
    try {
      let {
        query: { eventId, orgId, userId, fileName }
      } = req;

      const url = `dimensions/?${objectToQueryString(req.query)}`;

      const { data } = await client.get(url);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
