import cors from "cors";
import {
  AddDocumentPayload,
  GetDocumentsParams
} from "features/api/documentsApi";
import { DOCUMENTS_LIMIT_PER_USER } from "models/Document";
import { getRefId } from "models/Entity";
import { IGallery } from "models/Gallery";
import { getEmail } from "models/Subscription";
import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { getSession } from "server/auth";
import { models } from "server/database";
import { logEvent, ServerEventTypes } from "server/logging";
import { createEndpointError } from "utils/errors";
import { equals, normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>().use(cors());

handler.get<
  NextApiRequest & {
    query: GetDocumentsParams;
  },
  NextApiResponse
>(async function getDocuments(req, res) {
  try {
    const documents = await models.Document.find({});
    res.status(200).json(documents);
  } catch (error) {
    console.log("🚀 ~ getDocuments ~ error:", error);
  }
});

handler.post<NextApiRequest & { body: AddDocumentPayload }, NextApiResponse>(
  async function addDocument(req, res) {
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ POST /documents `;
    //console.log(prefix + "body", req.body);
    console.log(prefix);

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

    const fsMb = body.documentBytes / (1024 * 1024);

    if (!session.user.isAdmin && fsMb > 3) {
      return res
        .status(400)
        .json(createEndpointError(new Error("L'image est trop volumineuse")));
    }

    try {
      let gallery: (IGallery & Document<any, any, IGallery>) | null | undefined;
      let eventId: string | undefined;
      let orgId: string | undefined;
      let isAttendee = false;

      if (body.gallery?._id) {
        gallery = await models.Gallery.findOne({ _id: body.gallery._id });

        if (gallery) {
          const userDocuments = gallery.galleryDocuments.filter((doc) =>
            equals(session.user.userId, getRefId(doc))
          );

          if (userDocuments.length >= DOCUMENTS_LIMIT_PER_USER) {
            return res
              .status(400)
              .json(
                createEndpointError(
                  new Error(
                    `Vous avez atteint la limite de ${DOCUMENTS_LIMIT_PER_USER} photos pour cette galerie`
                  )
                )
              );
          }

          if (gallery.org) {
            orgId = getRefId(gallery.org, "_id");

            const org = await models.Org.findOne({ _id: orgId }).populate({
              path: "orgLists",
              populate: {
                path: "subscriptions",
                select: "email",
                populate: { path: "user", select: "email" }
              }
            });

            if (org) {
              const attendees = org.orgLists.find(
                ({ listName }) => listName === "Participants"
              );
              isAttendee = !!(attendees?.subscriptions || []).find(
                (sub) => getEmail(sub) === session.user.email
              );
            }
          } else {
            eventId = gallery.galleryName;
            const event = await models.Event.findOne({ _id: eventId }).populate(
              {
                path: "eventOrgs",
                populate: {
                  path: "orgLists",
                  populate: {
                    path: "subscriptions",
                    select: "email",
                    populate: { path: "user", select: "email" }
                  }
                }
              }
            );

            if (event) {
              const attendees =
                event.eventOrgs[0].orgLists.find(
                  ({ listName }) => listName === "Participants"
                )?.subscriptions || [];
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
                "Il faut avoir participé à un atelier pour ajouter une photo"
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

      res.status(200).json({
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
