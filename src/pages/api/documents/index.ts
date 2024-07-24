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
  .get<
    NextApiRequest & {
      query: {
        galleryId?: string;
        eventId?: string;
        orgId?: string;
        userId?: string;
      };
    },
    NextApiResponse
  >(async function getDocuments(req, res) {
    try {
      let {
        query: { galleryId, eventId, orgId, userId }
      } = req;

      if (!galleryId && !eventId && !orgId && !userId)
        return res
          .status(400)
          .json(createEndpointError(new Error("Veuillez indiquer un id")));

      const { data } = await client.get(
        galleryId
          ? `?galleryId=${galleryId}`
          : eventId
          ? `?eventId=${eventId}`
          : orgId
          ? `?orgId=${orgId}`
          : `?userId=${userId}`
      );

      res.status(200).json(data);
    } catch (error) {
      res.status(404).json(createEndpointError(error));
    }
  });

export default handler;
