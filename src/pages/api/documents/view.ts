import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createEndpointError } from "utils/errors";
import { objectToQueryString } from "utils/query";
import { getExtension } from "utils/string";

import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API2,
  responseType: "arraybuffer",
  withCredentials: true,
  httpsAgent: agent
});

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(cors())
  .get<NextApiRequest & { query: { fileName: string } }, NextApiResponse>(
    async function view(req, res) {
      try {
        let {
          query: { fileName }
        } = req;

        const url = `view?${objectToQueryString(req.query)}`;
        const response = await client.get(url, {
          responseType: "arraybuffer"
        });
        const img = response.data;
        //const img = Buffer.from(response.data, "binary").toString("base64");
        res.setHeader("Content-Length", img.length);
        res.setHeader("Content-Type", `image/${getExtension(fileName)}`);
        res.status(200).end(img);
        // const buffer = Buffer.from(arrayBuffer.data, "binary").toString("base64");
        // const image = `data:${arrayBuffer.headers["content-type"]};base64,${buffer}`;
        // res.status(200).send(image);
      } catch (error) {
        res.status(404).json(createEndpointError(error));
      }
    }
  );

export default handler;
