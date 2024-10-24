import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createEndpointError } from "utils/errors";

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
  .get<NextApiRequest, NextApiResponse>(async function all(req, res) {
    // console.log("🚀 ~ GET ~ all");
    try {
      const { data } = await client.get(`/`);
      // console.log("🚀 ~ all ~ data:", data);
      res.status(200).json({ data });
    } catch (error) {
      // console.log("🚀 ~ all ~ error:", error);
      res.status(400).json(createEndpointError(error));
    }
  });

export default handler;
