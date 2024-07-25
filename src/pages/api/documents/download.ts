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
    async function download(req, res) {
      try {
        let {
          query: { id, fileName }
        } = req;

        const url = `download?id=${id}`;
        const response = await client.get(url);
        const img = response.data;

        //const buffer = Buffer.from(response.data, "binary").toString("base64");
        // const img = Buffer.from(response.data, "base64");
        //const img = `data:image/png;base64,${buffer}`;

        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        res.setHeader("Content-Length", img.length);
        res.setHeader("Content-Type", `image/${getExtension(fileName)}`);
        res.status(200).send(img);
        // res.status(200).end(img);
      } catch (error) {
        res.status(500).json(createEndpointError(error));
      }
    }
  );

export default handler;
