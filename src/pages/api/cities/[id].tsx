import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createEndpointError } from "utils/errors";

import https from "https";
import cors from "cors";
import axios from "axios";
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  responseType: "text",
  withCredentials: true,
  httpsAgent: agent
});

const handler = nextConnect<NextApiRequest, NextApiResponse>().use(cors());

handler.get<NextApiRequest & { query: { id: string } }, NextApiResponse>(
  async function getCity(req, res) {
    const {
      query: { id }
    } = req;

    try {
      if (typeof id === "string") {
        const response = await client.get(
          "https://app.panneaupocket.com/embeded/" + id
        );

        const html = response.data;
        if (typeof html === "string") {
          return res.status(200).send(html);
        }
      }

      res.status(404).send("Not Found");
    } catch (error) {
      res.status(500).json(createEndpointError(error));
    }
  }
);

export default handler;
