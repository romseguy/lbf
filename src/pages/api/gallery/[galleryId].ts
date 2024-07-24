import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { EditGalleryPayload } from "features/api/galleriesApi";
import { getRefId } from "models/Entity";
import { getSession } from "server/auth";
import { createEndpointError } from "utils/errors";
import { equals } from "utils/string";

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
    const {
      body
    }: {
      body: EditGalleryPayload;
    } = req;

    const galleryId = req.query.galleryId;
    let gallery = await models.Gallery.findOne(
      { _id: galleryId },
      "+galleryMessages"
    );

    if (!gallery)
      return res
        .status(404)
        .json(
          createEndpointError(new Error(`La galerie ${galleryId} n'existe pas`))
        );

    if (body.gallery) {
      const isCreator = equals(gallery.createdBy, session.user.userId);

      if (!isCreator && !session.user.isAdmin)
        return res
          .status(403)
          .json(
            createEndpointError(
              new Error(
                "Vous ne pouvez pas modifier une galerie que vous n'avez pas créé"
              )
            )
          );

      await models.Gallery.updateOne({ _id: galleryId }, body.gallery);

      // if (nModified !== 1)
      //   throw new Error("La galerie n'a pas pu être modifié");
    }

    res.status(200).json({});
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
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const galleryId = req.query.galleryId;
    let gallery = await models.Gallery.findOne({ _id: galleryId });

    if (!gallery) {
      return res
        .status(404)
        .json(
          createEndpointError(new Error(`La galerie n'a pas pu être trouvée`))
        );
    }

    gallery = await gallery.populate("org event").execPopulate();
    const isCreator = equals(
      getRefId(gallery.org || gallery.event),
      session.user.userId
    );
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

    //#region entity references
    if (gallery.org) {
      console.log("deleting org reference to gallery", gallery.org);
      await models.Org.updateOne(
        { _id: gallery.org._id },
        {
          $pull: { orgGalleries: gallery._id }
        }
      );
    } else if (gallery.event) {
      console.log("deleting event reference to gallery", gallery.event);
      await models.Event.updateOne(
        {
          _id:
            typeof gallery.event === "object"
              ? gallery.event._id
              : gallery.event
        },
        {
          $pull: { eventGalleries: gallery._id }
        }
      );
    }
    //#endregion

    //#region subscription reference
    // const subscriptions = await models.Subscription.find({});
    // let count = 0;
    // for (const subscription of subscriptions) {
    //   if (!subscription.galleries) continue;
    //   subscription.galleries = subscription.galleries.filter(
    //     (galleriesubscription) => {
    //       if (galleriesubscription.gallery === null) return false;
    //       if (equals(galleriesubscription.gallery._id, gallery!._id)) {
    //         count++;
    //         return false;
    //       }
    //       return true;
    //     }
    //   );
    //   await subscription.save();
    // }
    // if (count > 0)
    //   console.log(count + " subscriptions references to gallery deleted");
    //#endregion

    const { deletedCount } = await models.Gallery.deleteOne({ _id: galleryId });
    if (deletedCount !== 1)
      throw new Error(`La galerie n'a pas pu être supprimée`);
    res.status(200).json(gallery);
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
