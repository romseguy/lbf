import type { ITopic } from "models/Topic";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getOrg(req, res) {
  const query: { orgName?: string | string[] } = req.query;
  let orgNameLower;

  if (query.orgName && typeof query.orgName === "string") {
    orgNameLower = query.orgName.toLowerCase();
  }

  try {
    const org = await models.Org.findOne({ orgNameLower })
      .populate("createdBy", "-email -password -userImage")
      .populate("orgEvents orgSubscriptions orgTopics")
      .populate({
        path: "orgTopics",
        populate: [
          {
            path: "topicMessages",
            populate: { path: "createdBy", select: "-email -password" }
          },
          { path: "createdBy", select: "-email -password" }
        ]
      })
      .populate({
        path: "orgSubscriptions",
        populate: { path: "user", select: "-email -password" }
      });

    if (org) {
      res.status(200).json(org);
    } else {
      res
        .status(404)
        .json(
          createServerError(new Error("Le document n'a pas pu être trouvé"))
        );
    }
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
});

handler.post<NextApiRequest, NextApiResponse>(async function postOrgDetails(
  req,
  res
) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const {
        query: { orgName },
        body
      } = req;

      const org = await models.Org.findOne({ orgName });

      const addOrUpdateSub = async (userId: string, topic: ITopic) => {
        if (!userId) return;

        const user = await models.User.findOne({ _id: userId });

        if (!user) return;

        let subscription = await models.Subscription.findOne({ user });

        if (!subscription) {
          subscription = await models.Subscription.create({
            user,
            topics: [{ topic }]
          });
        } else {
          let topicSubscription = subscription.topics.find(
            (topic: ITopic) => topic._id === body.topic._id
          );

          if (!topicSubscription) {
            console.log("no sub for this topic");
            subscription.topics.push({ topic });
            await subscription.save();
          }
        }
      };

      if (body.topic) {
        let createdBy;
        let topic = body.topic;

        if (body.topic._id) {
          // existing topic => adding messages
          const topic = await models.Topic.findOne({ _id: body.topic._id });

          for (const topicMessage of body.topic.topicMessages) {
            createdBy = topicMessage.createdBy;
            topic.topicMessages.push(topicMessage);
          }

          await topic.save();
        } else {
          // new topic
          topic = await models.Topic.create(body.topic);
          createdBy = topic.createdBy;
          org.orgTopics.push(topic);
          await org.save();
        }

        addOrUpdateSub(createdBy, topic);
      }

      res.status(200).json(org);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.put<NextApiRequest, NextApiResponse>(async function editOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const {
        query: { orgName }
      } = req;

      let body = req.body;

      if (typeof body.orgName === "string" && !body.orgNameLower) {
        body.orgNameLower = body.orgName.toLowerCase();
      }

      const { n, nModified } = await models.Org.updateOne({ orgName }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgName} n'a pas pu être modifiée`)
            )
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.delete(async function removeOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    const {
      query: { orgName }
    } = req;

    try {
      const org = await models.Org.findOne({ orgName });
      const { deletedCount } = await models.Org.deleteOne({ orgName });

      if (deletedCount === 1) {
        res.status(200).json(org);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`L'organisation ${orgName} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
