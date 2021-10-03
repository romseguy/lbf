import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError, databaseErrorCodes } from "utils/errors";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function signup(req, res) {
  const {
    body: { email, password }
  } = req;

  try {
    if (emailR.test(email)) {
      if (await models.User.findOne({ email })) {
        const userFoundError: Error & { code?: number } = new Error();
        userFoundError.code = databaseErrorCodes.DUPLICATE_KEY;
        throw userFoundError;
      }

      const user = await models.User.create({ email, password });
      res.status(200).json(user);
    } else {
      res.status(400).json({ email: "Cette adresse e-mail est invalide" });
    }
  } catch (error: any) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
      res.status(400).json({
        email: "Cette adresse e-mail n'est pas disponible"
      });
    } else {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
