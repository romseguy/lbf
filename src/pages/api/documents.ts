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
import { getRefId } from "models/Entity";
import { normalize } from "utils/string";

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
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ POST /documents `;
    console.log(prefix + "body", req.body);

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
      const document = await models.Document.create({
        ...body,
        createdBy: session.user.userId
      });

      if (body.gallery?._id) {
        //let gallery: (IGallery & Document<any, any, IGallery>) | null | undefined;
        const gallery = await models.Gallery.findOne({ _id: body.gallery._id });

        // if (!gallery) {
        //   gallery = await models.Gallery.create({
        //     ...body.gallery
        //   });
        // }

        // if (!gallery) {
        //   return res
        //     .status(401)
        //     .json(createEndpointError(new Error("Galerie introuvable")));
        // }

        if (gallery) {
          await models.Gallery.updateOne(
            { _id: gallery._id },
            { $push: { galleryDocuments: document._id } }
          );

          logEvent({
            type: ServerEventTypes.DOCUMENTS,
            metadata: {
              documentName: document.documentName,
              documentUrl: `${process.env.NEXT_PUBLIC_URL}/${
                gallery.org ? "photo" : gallery.galleryName
              }/${gallery.org ? "galeries" : "galerie"}/${
                gallery.org ? normalize(gallery.galleryName) : ""
              }`
            }
          });

          if (gallery.org) {
            return res.status(200).json({
              documentId: document._id,
              orgId: getRefId(gallery.org, "_id")
            });
          }

          return res
            .status(200)
            .json({ documentId: document._id, galleryId: gallery._id });
        }
      }

      res.status(200).json({ documentId: document._id });
    } catch (error: any) {
      //logEvent({
      //   type: ServerEventTypes.API_ERROR,
      //   metadata: {
      //     error,
      //     method: "POST",
      //     url: `/api/documents`
      //   }
      // });
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
