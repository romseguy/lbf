import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function signin(req, res) {
  const {
    body: { email, password }
  } = req;

  try {
    const user = await models.User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res
        .status(403)
        .json({ email: "Cette adresse e-mail ne correspond à aucun compte" });
      return;
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      res
        .status(403)
        .json(
          createServerError(new Error("La tentative de connexion a échouée"))
        );
    } else {
      user.isOnline = true;
      await user.save();

      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
});

export default handler;
