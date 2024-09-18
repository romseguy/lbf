import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import {
  EditGalleryPayload,
  GetGalleryParams
} from "features/api/galleriesApi";
import { getRefId } from "models/Entity";
import { getSession } from "server/auth";
import { createEndpointError } from "utils/errors";
import { equals } from "utils/string";

import axios from "axios";
import https from "https";
import { getClientIp } from "server/ip";
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

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

// handler.post<
//   NextApiRequest & {
//     query: { galleryId: string };
//     body: AddGalleryNotifPayload;
//   },
//   NextApiResponse
// >(async function addGalleryNotif(req, res) {
//   const session = await getSession({ req });

//   if (!session) {
//     return res
//       .status(401)
//       .json(createEndpointError(new Error("Vous devez être identifié")));
//   }

//   try {
//     const {
//       query: { galleryId },
//       body
//     }: {
//       query: { galleryId: string };
//       body: AddGalleryNotifPayload;
//     } = req;

//     const gallery = await models.Gallery.findOne({ _id: galleryId });

//     if (!gallery) {
//       return res
//         .status(404)
//         .json(
//           createEndpointError(
//             new Error(`La galerie ${galleryId} n'existe pas`)
//           )
//         );
//     }

//     if (!equals(gallery.createdBy, session.user.userId) && !session.user.isAdmin)
//       return res
//         .status(403)
//         .json(
//           createEndpointError(
//             new Error(
//               "Vous ne pouvez pas envoyer des notifications pour une galerie que vous n'avez pas créé"
//             )
//           )
//         );

//     let notifications: IGalleryNotification[] = [];

//     if (typeof body.email === "string" && body.email.length > 0) {
//       let subscription = await models.Subscription.findOne({
//         email: body.email
//       });

//       if (!subscription) {
//         const user = await models.User.findOne({ email: body.email });

//         if (user)
//           subscription = await models.Subscription.findOne({ user: user._id });
//       }

//       const mail = createGalleryEmailNotif({
//         email: body.email,
//         event: body.event,
//         org: body.org,
//         gallery,
//         subscriptionId: subscription?._id || session.user.userId
//       });

//       try {
//         await sendMail(mail);
//       } catch (error: any) {
//         const { getEnv } = require("utils/env");
//         if (getEnv() === "development") {
//           if (error.command !== "CONN") {
//             throw error;
//           }
//         }
//       }

//       notifications = [
//         {
//           email: body.email,
//           createdAt: new Date().toISOString()
//         }
//       ];

//       if (body.email !== session.user.email) {
//         gallery.galleryNotifications =
//           gallery.galleryNotifications.concat(notifications);
//         await gallery.save();
//       }
//     } else if (body.event) {
//       let event = await models.Event.findOne({ _id: body.event._id });
//       if (!event) return res.status(400).json("Événement introuvable");

//       event = await event
//         .populate({
//           path: "eventSubscriptions",
//           select: "+email +phone",
//           populate: { path: "user", select: "+email +phone +userSubscription" }
//         })
//         .execPopulate();

//       notifications = await sendGalleryNotifications({
//         event,
//         subscriptions: event.eventSubscriptions,
//         gallery
//       });
//     } else if (body.orgListsNames) {
//       //console.log(`POST /gallery/${galleryId}: orgListsNames`, body.orgListsNames);

//       for (const orgListName of body.orgListsNames) {
//         const [_, listName, orgId] = orgListName.match(/([^\.]+)\.(.+)/) || [];

//         let org: (IOrg & Document<any, IOrg>) | null | undefined;
//         org = await models.Org.findOne({ _id: orgId });
//         if (!org) return res.status(400).json("Organisation introuvable");

//         let subscriptions: ISubscription[] = [];

//         if (["Abonnés"].includes(listName)) {
//           org = await org
//             .populate({
//               path: "orgSubscriptions",
//               select: "+email +phone",
//               populate: {
//                 path: "user",
//                 select: "+email +phone +userSubscription"
//               }
//             })
//             .execPopulate();

//           if (listName === "Abonnés") {
//             subscriptions = subscriptions.concat(
//               getSubscriptions(org, EOrgSubscriptionType.FOLLOWER)
//             );
//           }
//         } else {
//           org = await org
//             .populate({
//               path: "orgLists",
//               populate: [
//                 {
//                   path: "subscriptions",
//                   select: "+email +phone",
//                   populate: {
//                     path: "user",
//                     select: "+email +phone +userSubscription"
//                   }
//                 }
//               ]
//             })
//             .execPopulate();

//           const list = org.orgLists.find(
//             (orgList) => orgList.listName === listName
//           );

//           if (list && list.subscriptions) subscriptions = list.subscriptions;
//         }

//         notifications = await sendGalleryNotifications({
//           org,
//           subscriptions,
//           gallery
//         });
//       }
//     }

//     res.status(200).json({ notifications });
//   } catch (error) {
//     res.status(500).json(createEndpointError(error));
//   }
// });

handler.get<
  NextApiRequest & {
    query: GetGalleryParams;
  },
  NextApiResponse
>(async function getGallery(req, res) {
  let {
    query: { galleryId }
  } = req;

  let _id: string | undefined;

  try {
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ GET /gallery/${galleryId} `;
    console.log(prefix);

    let gallery = await models.Gallery.findOne({ galleryName: galleryId });
    if (!gallery) {
      _id = galleryId;
      gallery = await models.Gallery.findOne({ _id });
      if (!gallery) {
        return res
          .status(404)
          .json(
            createEndpointError(
              new Error(`La galerie ${galleryId} n'a pas pu être trouvée`)
            )
          );
      }
    }

    //logEvent({
    //   type: ServerEventTypes.API_CALL,
    //   metadata: {
    //     method: "GET",
    //     ip: getClientIp(req),
    //     url: `/api/${galleryId}`,
    //     galleryName: gallery.galleryName
    //   }
    // });

    const session = await getSession({ req });
    const isCreator =
      equals(getRefId(gallery), session?.user.userId) || session?.user.isAdmin;
    gallery = await gallery
      .populate([
        {
          path: "galleryDocuments",
          populate: [
            {
              path: "createdBy",
              select: "_id userName"
            }
          ]
        },
        { path: "createdBy", select: "_id userName" }
      ])
      .execPopulate();

    // console.log(prefix + "gallery:", gallery);
    res.status(200).json(gallery);
  } catch (error: any) {
    if (error.kind === "ObjectId")
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`La galerie ${galleryId} n'a pas pu être trouvé`)
          )
        );
    res.status(500).json(createEndpointError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { galleryId: string };
    body: EditGalleryPayload;
  },
  NextApiResponse
>(async function editGallery(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ PUT /gallery/[galleryId] `;
    console.log(prefix + JSON.stringify(req.query));

    const {
      body
    }: {
      body: EditGalleryPayload;
    } = req;

    let _id: string | undefined;
    let gallery = await models.Gallery.findOne({
      galleryName: req.query.galleryId
    });

    if (!gallery) {
      _id = req.query.galleryId;
      gallery = await models.Gallery.findOne({ _id });
      if (!gallery)
        return res
          .status(404)
          .json(
            createEndpointError(
              new Error(`La galerie ${req.query.galleryId} n'existe pas`)
            )
          );
    }

    // const isCreator = equals(gallery.createdBy, session.user.userId);

    // if (!isCreator && !session.user.isAdmin)
    //   return res
    //     .status(403)
    //     .json(
    //       createEndpointError(
    //         new Error(
    //           "Vous ne pouvez pas modifier une galerie que vous n'avez pas créé"
    //         )
    //       )
    //     );

    const editedGallery = await models.Gallery.findOneAndUpdate(
      { _id },
      body.gallery
    );
    res.status(200).json(editedGallery);
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: { galleryId: string };
  },
  NextApiResponse
>(async function removeGallery(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ DELETE /gallery/[galleryId] `;
  console.log(prefix + "query", req.query);

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.galleryId;
    let gallery = await models.Gallery.findOne({ _id });

    if (!gallery) {
      return res
        .status(404)
        .json(createEndpointError(new Error(`Galerie introuvable`)));
    }

    gallery = await gallery.populate("org").execPopulate();

    const isCreator = equals(getRefId(gallery.org), session.user.userId);
    const isGalleryCreator = equals(getRefId(gallery), session.user.userId);
    if (!isCreator && !isGalleryCreator && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createEndpointError(
            new Error(
              "Vous ne pouvez pas supprimer une galerie que vous n'avez pas créé"
            )
          )
        );

    const { deletedCount } = await models.Gallery.deleteOne({ _id });

    if (deletedCount !== 1) {
      return res
        .status(400)
        .json(
          createEndpointError(
            new Error(`La galerie ${_id} n'a pas pu être supprimée`)
          )
        );
    }

    //#region references
    console.log(prefix + "deleting matching documents");
    for (const _id of gallery.galleryDocuments || []) {
      await client.delete(`/?fileId=${_id}`);
      await models.Document.deleteOne({ _id });
    }

    if (gallery.org) {
      const orgId = getRefId(gallery.org);
      console.log(prefix + "deleting gallery from org", orgId);
      await models.Org.updateOne(
        { _id: orgId },
        {
          $pull: { orgGalleries: _id }
        }
      );
    }
    //#endregion

    logEvent({
      type: ServerEventTypes.GALLERIES_DEL,
      metadata: {
        gallery
      }
    });

    res.status(200).json({ ...gallery._doc });
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default handler;
