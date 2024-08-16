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
import { IGallery } from "models/Gallery";
import { Document } from "mongoose";
import { getEmail } from "models/Subscription";

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
    console.log("🚀 ~ addDocument ~ session:", session);

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
      let gallery: (IGallery & Document<any, any, IGallery>) | null | undefined;
      let eventId: string | undefined;
      let orgId: string | undefined;
      let isAttendee = false;

      if (body.gallery?._id) {
        gallery = await models.Gallery.findOne({ _id: body.gallery._id });

        if (gallery) {
          if (gallery.org) {
            orgId = getRefId(gallery.org, "_id");

            const org = await models.Org.findOne({ _id: orgId }).populate({
              path: "orgLists",
              populate: { path: "subscriptions" }
            });

            if (org) {
              const attendees =
                org.orgLists.find(({ listName }) => {
                  return listName === "Participants";
                })?.subscriptions || [];

              isAttendee = !!attendees.find(
                (sub) => getEmail(sub) === session.user.email
              );
            }
          } else {
            eventId = gallery.galleryName;
            const event = await models.Event.findOne({ _id: eventId }).populate(
              "eventOrgs"
            );

            if (event) {
              const attendees =
                event.eventOrgs[0].orgLists.find(({ listName }) => {
                  return listName === "Participants";
                })?.subscriptions || [];

              isAttendee = !!attendees.find(
                (sub) => getEmail(sub) === session.user.email
              );
            }
          }
        }
      }

      if (!session.user.isAdmin && !isAttendee) {
        return res
          .status(401)
          .json(
            createEndpointError(
              new Error(
                "Vous devez être inscrit en tant que participant pour ajouter une photo"
              )
            )
          );
      }

      const document = await models.Document.create({
        ...body,
        createdBy: session.user.userId
      });

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
      }

      res
        .status(200)
        .json({
          documentId: document._id,
          galleryId: gallery?._id,
          eventId,
          orgId
        });
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
