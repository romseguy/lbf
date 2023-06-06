import axios from "axios";
import cors from "cors";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createServerError } from "utils/errors";
import { objectToQueryString } from "utils/query";

import https from "https";
import { getExtension } from "utils/string";
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
  .get<NextApiRequest & { query: { fileName: string } }, NextApiResponse>(
    async function download(req, res) {
      try {
        let {
          query: { orgId, userId, fileName }
        } = req;

        const url = `view?${objectToQueryString(req.query)}`;
        const response = await client.get(url, {
          responseType: "arraybuffer"
        });
        res.setHeader("Content-Type", `image/${getExtension(fileName)}`);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        res.status(200).send(response.data);
      } catch (error) {
        res.status(404).json(createServerError(error));
      }
    }
  );

export default handler;
