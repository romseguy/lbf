import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { addOrUpdateTopic } from "api";
import database, { models } from "database";
import { getSession } from "hooks/useAuth";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import { createServerError } from "utils/errors";
import { equals, normalize } from "utils/string";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & { query: { orgUrl: string; populate?: string } },
  NextApiResponse
>(async function getOrg(req, res) {
  try {
    const session = await getSession({ req });
    const {
      query: { orgUrl, populate }
    } = req;

    let org = await models.Org.findOne({ orgUrl });

    if (!org)
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
          )
        );

    // hand emails to org creator only
    const isCreator =
      equals(org.createdBy, session?.user.userId) || session?.user.isAdmin;

    console.log(org.orgName, "isCreator", isCreator);

    let select = isCreator
      ? "-password -securityCode"
      : "-email -password -securityCode";

    if (populate) {
      if (populate.includes("orgs")) {
        org = org.populate("orgs");
      }

      if (populate.includes("orgEvents")) {
        org = org.populate("orgEvents");
      }

      if (populate.includes("orgProjects"))
        org = org.populate({
          path: "orgProjects",
          populate: [{ path: "projectOrgs createdBy" }]
        });

      if (populate.includes("orgTopics"))
        org = org.populate({
          path: "orgTopics",
          populate: [
            {
              path: "topicMessages",
              populate: { path: "createdBy" }
            },
            { path: "createdBy" }
          ]
        });

      if (populate.includes("orgSubscriptions")) {
        org = org.populate({
          path: "orgSubscriptions",
          select: isCreator ? undefined : "-email",
          populate: {
            path: "user",
            select: isCreator
              ? "-password -securityCode"
              : "-email -password -securityCode"
          }
        });
      }
    }

    org = await org
      .populate("createdBy", select + " -userImage")
      .execPopulate();

    if (!populate || !populate.includes("orgLogo")) {
      org.orgLogo = undefined;
    }
    if (!populate || !populate.includes("orgBanner")) {
      org.orgBanner = undefined;
    }

    for (const orgEvent of org.orgEvents) {
      if (orgEvent.forwardedFrom?.eventId) {
        const e = await models.Event.findOne({
          _id: orgEvent.forwardedFrom.eventId
        });
        if (e) {
          orgEvent.forwardedFrom.eventUrl = orgEvent._id;
          orgEvent.eventName = e.eventName;
          orgEvent.eventUrl = e.eventUrl;
        }
      }
    }

    for (const orgTopic of org.orgTopics) {
      if (orgTopic.topicMessages) {
        for (const topicMessage of orgTopic.topicMessages) {
          if (typeof topicMessage.createdBy === "object") {
            if (
              !topicMessage.createdBy.userName &&
              topicMessage.createdBy.email
            ) {
              topicMessage.createdBy.userName =
                topicMessage.createdBy.email.replace(/@.+/, "");
            }
            // todo: check this
            // topicMessage.createdBy.email = undefined;
          }
        }
      }
    }

    res.status(200).json(org);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { orgUrl: string };
    body: IOrg;
  },
  NextApiResponse
>(async function editOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      let { body }: { body: IOrg } = req;
      const orgUrl = req.query.orgUrl;
      const org = await models.Org.findOne({ orgUrl });

      if (!org) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
            )
          );
      }

      if (
        !equals(org.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas modifier un organisation que vous n'avez pas créé."
              )
            )
          );
      }

      if (body.orgName) {
        body = { ...body, orgName: body.orgName.trim() };
        body.orgUrl = normalize(body.orgName);
      }

      const { n, nModified } = await models.Org.updateOne({ orgUrl }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être modifiée`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

handler.delete<
  NextApiRequest & {
    query: { orgUrl: string };
  },
  NextApiResponse
>(async function removeOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const orgUrl = req.query.orgUrl;
      const org = await models.Org.findOne({ orgUrl });

      if (!org) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)
            )
          );
      }

      if (
        !equals(org.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas supprimer une organisation que vous n'avez pas créé."
              )
            )
          );
      }

      const { deletedCount } = await models.Org.deleteOne({ orgUrl });

      // todo delete references to this org

      if (deletedCount === 1) {
        res.status(200).json(org);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgUrl} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
