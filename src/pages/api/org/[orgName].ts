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
      .populate({
        path: "orgTopics",
        populate: { path: "createdBy" }
      })
      .populate({
        path: "orgTopics.topicMessages",
        populate: { path: "createdBy" }
      })
      .populate("orgEvents orgSubscriptions createdBy")
      .populate({
        path: "orgSubscriptions",
        populate: { path: "user" }
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

      if (body.topic) {
        if (body.topic._id) {
          const orgTopic = org.orgTopics.find(
            (topic: ITopic) => topic.id === body.topic._id
          );

          for (const topicMessage of body.topic.topicMessages) {
            orgTopic.topicMessages.push(topicMessage);
          }
        } else {
          org.orgTopics.push(body.topic);
        }

        await org.save();
        res.status(200).json(org);
      } else {
        res.status(200).json(org);
      }
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
