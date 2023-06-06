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
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    try {
      const { data } = await client.get(`size`);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
