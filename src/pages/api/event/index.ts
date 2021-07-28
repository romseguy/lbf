import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";

interface Response {}

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function getEventsByEmail(
  req,
  res
) {
  const {
    query: { email }
  } = req;

  const createdBy = email;

  try {
    const events = await models.Event.find({ createdBy });

    if (events) {
      res.status(200).json(events);
    } else {
      res
        .status(404)
        .json(
          createServerError(new Error("Aucun événement pour cet utilisateur"))
        );
    }
  } catch (error) {
    createServerError(error);
  }
});

export default handler;
