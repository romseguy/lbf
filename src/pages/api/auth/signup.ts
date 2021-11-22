import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { emailR } from "utils/email";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<
  NextApiRequest & { body: { email: string; password: string } },
  NextApiResponse
>(async function signup(req, res) {
  try {
    const {
      body: { email, password }
    }: { body: { email: string; password: string } } = req;

    if (!emailR.test(email))
      return res
        .status(400)
        .json({ email: "Cette adresse e-mail est invalide" });

    if (await models.User.findOne({ email })) throw duplicateError();

    const user = await models.User.create({
      email,
      password,
      userName: normalize(email.replace(/@.+/, ""))
    });

    res.status(200).json(user);
  } catch (error: any) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY)
      return res.status(400).json({
        email: "Cette adresse e-mail n'est pas disponible"
      });

    res.status(500).json(createServerError(error));
  }
});

export default handler;
