import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
// import {
//   sendGalleryMessageNotifications,
//   sendGalleryNotifications
// } from "server/email";
import { AddGalleryPayload } from "features/api/galleriesApi";
import { getSession } from "server/auth";
import { IGallery } from "models/Gallery";
import { createEndpointError } from "utils/errors";
import { logEvent, ServerEventTypes } from "server/logging";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

// handler.get<
//   NextApiRequest & {
//     query: { createdBy?: string };
//   },
//   NextApiResponse
// >(async function getGalleries(req, res) {
//   try {
//     const {
//       query: { populate, createdBy }
//     } = req;

//     const selector = createdBy ? { createdBy } : {};
//     //logJson(`GET /galleries: selector`, selector);

//     let galleries: (IGallery & Document<any, IGallery>)[] = [];

//     if (populate?.includes("galleryMessages.createdBy")) {
//       galleries = await models.Gallery.find(
//         selector,
//         "-galleryMessages.message"
//       ).populate([
//         {
//           path: "galleryMessages",
//           populate: [{ path: "createdBy", select: "_id" }]
//         }
//       ]);
//     } else {
//       galleries = await models.Gallery.find(selector);
//     }

//     if (hasItems(galleries)) {
//       if (populate?.includes("org")) {
//         // galleries = await Promise.all(
//         //   galleries.map((gallery) => gallery.populate(populate).execPopulate())
//         for (const gallery of galleries) {
//           await gallery.populate({ path: "org" }).execPopulate();
//         }
//       }
//       if (populate?.includes("event")) {
//         // galleries = await Promise.all(
//         //   galleries.map((gallery) => gallery.populate(populate).execPopulate())
//         for (const gallery of galleries) {
//           await gallery.populate({ path: "event" }).execPopulate();
//         }
//       }
//     }

//     logJson(`GET /galleries: galleries`, galleries);
//     res.status(200).json(galleries);
//   } catch (error) {
//     res.status(500).json(createEndpointError(error));
//   }
// });

handler.post<NextApiRequest & { body: AddGalleryPayload }, NextApiResponse>(
  async function addGallery(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(
          createEndpointError(
            new Error("Vous devez être identifié pour ajouter une galerie")
          )
        );
    }

    try {
      const {
        body
      }: {
        body: AddGalleryPayload;
      } = req;

      // let event: (IEvent & Document<any, IEvent>) | null | undefined;
      // let org: (IOrg & Document<any, IOrg>) | null | undefined;

      // if (body.event)
      //   event = await models.Event.findOne({ _id: body.event._id });
      // else if (body.org) org = await models.Org.findOne({ _id: body.org._id });

      // if (!event && !org) {
      //   return res
      //     .status(400)
      //     .json(
      //       createEndpointError(
      //         new Error(
      //           "La discussion doit être associée à une organisation ou à un événément"
      //         )
      //       )
      //     );
      // }

      let gallery: (IGallery & Document<any, IGallery>) | null | undefined;

      let galleryName = body.gallery.galleryName;
      // const galleryWithSameName = await models.Gallery.findOne({
      //   galleryName
      // });
      // if (galleryWithSameName) {
      //   const uid = org
      //     ? org.orgGalleries.length + 1
      //     : event
      //     ? event.eventGalleries.length + 1
      //     : randomNumber(3);
      //   galleryName = `${galleryName}-${uid}`;
      // }

      gallery = await models.Gallery.create({
        ...body.gallery,
        galleryName,
        // galleryMessages: body.gallery.galleryMessages?.map(
        //   (galleryMessage) => ({
        //     ...galleryMessage,
        //     createdBy: session.user.userId
        //   })
        // ),
        createdBy: session.user.userId
      });

      //#region add gallery to entity and notify entity subscribers
      // if (event) {
      //   event.eventGalleries.push(gallery);
      //   await event.save();
      //   //log(`POST /galleries: event`, event);
      // } else
      if (body.org) {
        await models.Org.updateOne(
          { _id: body.org._id },
          {
            $push: { orgGalleries: gallery._id }
          }
        );
        // const subscriptions = await models.Subscription.find(
        //   {
        //     orgs: { $elemMatch: { orgId: org._id } },
        //     user: { $ne: session.user.userId }
        //   },
        //   "user email events orgs"
        // ).populate([{ path: "user", select: "email userSubscription" }]);
        // await sendGalleryNotifications({ org, subscriptions, gallery });
      }
      //#endregion

      //#region subscribe self to gallery
      // const user = await models.User.findOne({
      //   _id: session.user.userId
      // });
      //#endregion

      // if (user) {
      //   let subscription = await models.Subscription.findOne({ user });

      //   if (!subscription)
      //     subscription = await models.Subscription.create({
      //       user,
      //       galleries: [
      //         { gallery: gallery._id, emailNotif: true, pushNotif: true }
      //       ]
      //     });
      //   else {
      //     const galleriesubscription = subscription.galleries?.find(
      //       ({ gallery: t }) => equals(getRefId(t), gallery!._id)
      //     );

      //     if (!galleriesubscription) {
      //       await models.Subscription.updateOne(
      //         { _id: subscription._id },
      //         {
      //           $push: {
      //             galleries: {
      //               gallery: gallery._id,
      //               emailNotif: true,
      //               pushNotif: true
      //             }
      //           }
      //         }
      //       );
      //     }
      //   }
      // }

      res.status(200).json(gallery);
    } catch (error: any) {
      logEvent({
        type: ServerEventTypes.API_ERROR,
        metadata: {
          error,
          method: "POST",
          url: `/api/galleries`
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