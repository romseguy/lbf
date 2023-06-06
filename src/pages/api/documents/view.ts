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
  .get<NextApiRequest, NextApiResponse>(async function view(req, res) {
    try {
      let {
        query: { orgId, userId, fileName }
      } = req;

      const url = `view?${objectToQueryString(req.query)}`;
      const buffer = await client.get(url, {
        responseType: "arraybuffer"
      });
      res.status(200).write(buffer.data);
      // const buffer = Buffer.from(arrayBuffer.data, "binary").toString("base64");
      // const image = `data:${arrayBuffer.headers["content-type"]};base64,${buffer}`;
      // res.status(200).send(image);
    } catch (error) {
      res.status(404).json(createServerError(error));
    }
  });

export default handler;
