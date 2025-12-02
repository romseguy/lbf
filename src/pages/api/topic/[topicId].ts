import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { EditTopicPayload } from "features/api/topicsApi";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { getSession } from "server/auth";
import { createTopicEmailNotif } from "utils/email";
import { createEndpointError } from "utils/errors";
import { equals } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.put<
  NextApiRequest & {
    query: { topicId: string };
    body: EditTopicPayload;
  },
  NextApiResponse
>(async function editTopic(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ PUT /topic/${
    req.query.topicId
  } `;
  console.log(prefix);

  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const {
      body,
    }: {
      body: EditTopicPayload;
    } = req;

    const topicId = req.query.topicId;
    let topic = await models.Topic.findOne({ _id: topicId }, "+topicMessages");

    if (!topic)
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`La discussion ${topicId} n'existe pas`),
          ),
        );

    if (body.topic) {
      if (body.topicMessage) {
        const topicMessage = body.topic.topicMessages?.find(
          ({ _id }) => _id === body.topicMessage!._id,
        );

        if (!topicMessage || !topicMessage.createdBy)
          return res
            .status(404)
            .json(
              createEndpointError(new Error("Le message n'a pas été trouvé.")),
            );

        const isCreator = equals(getRefId(topicMessage), session.user.userId);

        if (!isCreator && !session.user.isAdmin)
          return res
            .status(403)
            .json(
              createEndpointError(
                new Error(
                  "Vous ne pouvez pas modifier le message d'une autre personne.",
                ),
              ),
            );

        topic.topicMessages = topic.topicMessages.map((topicMessage) => {
          if (!body.topicMessage) return topicMessage; // dumb ts
          if (equals(topicMessage._id, body.topicMessage._id)) {
            const newTM = {
              ...body.topicMessage,
              _id: topicMessage._id,
              createdAt: topicMessage.createdAt,
              createdBy: topicMessage.createdBy,
              updatedAt: new Date(), // FIXME https://stackoverflow.com/questions/39495671/mongodb-mongoose-timestamps-not-updating
            };
            return newTM;
          }

          return topicMessage;
        });
        await topic.save();
      } else if (body.topic.topicMessages) {
        topic.topicMessages = body.topic.topicMessages;
        await topic.save();
      } else {
        const isCreator = equals(topic.createdBy, session.user.userId);
        if (!isCreator && !session.user.isAdmin)
          return res
            .status(403)
            .json(
              createEndpointError(
                new Error(
                  "Vous ne pouvez pas modifier une discussion que vous n'avez pas créé",
                ),
              ),
            );

        await models.Topic.updateOne({ _id: topicId }, body.topic);

        // if (nModified !== 1)
        //   throw new Error("La discussion n'a pas pu être modifié");
      }
    }

    res.status(200).json({});
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default handler;
