import axios from "axios";
import cors from "cors";
import https from "https";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createEndpointError } from "utils/errors";
import { AddDocumentPayload } from "features/api/documentsApi";
import { getSession } from "server/auth";
import { models } from "server/database";
import { logEvent, ServerEventTypes } from "server/logging";

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

const handler = nextConnect<NextApiRequest, NextApiResponse>().use(cors());

handler.post<NextApiRequest & { body: AddDocumentPayload }, NextApiResponse>(
  async function addDocument(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(
          createEndpointError(
            new Error("Vous devez être identifié pour ajouter une photo")
          )
        );
    }

    const {
      body
    }: {
      body: AddDocumentPayload;
    } = req;

    try {
      let gallery = await models.Gallery.findOne({ _id: body.gallery._id });

      if (!gallery) {
        gallery = await models.Gallery.create({ ...body.gallery });
      }

      if (!gallery) {
        return res
          .status(401)
          .json(createEndpointError(new Error("Galerie introuvable")));
      }

      const document = await models.Document.create({
        ...body,
        createdBy: session.user.userId
      });

      await models.Gallery.updateOne(
        { _id: body.gallery._id },
        { $push: { galleryDocuments: document._id } }
      );

      res.status(200).json(document);
    } catch (error: any) {
      logEvent({
        type: ServerEventTypes.API_ERROR,
        metadata: {
          error,
          method: "POST",
          url: `/api/documents`
        }
      });
      res.status(500).json(createEndpointError(error));
    }
  }
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default handler;
