import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createServerError } from "utils/errors";

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
  .get<
    NextApiRequest & { query: { orgId?: string; userId?: string } },
    NextApiResponse
  >(async function getDocuments(req, res) {
    try {
      let {
        query: { orgId, userId }
      } = req;

      if (!orgId && !userId)
        return res
          .status(400)
          .json(createServerError(new Error("Veuillez indiquer un id")));

      const { data } = await client.get(
        orgId ? `?orgId=${orgId}` : `?userId=${userId}`
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
