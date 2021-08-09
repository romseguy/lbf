import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<NextApiRequest & { query: { userId: string } }, NextApiResponse>(
  async function getEvents(req, res) {
    try {
      const userId = req.query.userId;
      const events = await models.Event.find({ createdBy: userId });

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);
