import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { sendMail } from "api/email";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { emailR } from "utils/email";
import { randomNumber } from "utils/randomNumber";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function forgotten(
  req,
  res
) {
  const {
    body: { email, password }
  } = req;

  if (!emailR.test(email))
    return res.status(400).json({ email: "Cette adresse e-mail est invalide" });

  try {
    if (password) {
      await models.User.updateOne({ email }, { password });

      // if (nModified !== 1)
      //   return res
      //     .status(400)
      //     .json(
      //       createServerError(
      //         new Error("Le mot de passe n'a pas pu être modifié")
      //       )
      //     );

      return res.status(200).json({});
    }

    const securityCode = randomNumber(6);

    await models.User.updateOne({ email }, { securityCode });

    // if (nModified !== 1)
    //   return res
    //     .status(400)
    //     .json(
    //       createServerError(
    //         new Error("Cette adresse e-mail ne correspond à aucun compte")
    //       )
    //     );

    const mail = {
      from: process.env.EMAIL_FROM,
      to: `<${email}>`,
      subject: `${securityCode} est votre code de sécurité ${process.env.NEXT_PUBLIC_SHORT_URL}`,
      html: `<h1>Votre demande de réinitialisation de mot de passe</h1>Afin de réinitialiser votre mot de passse, veuillez saisir le code de sécurité suivant : ${securityCode}`
    };

    if (process.env.NODE_ENV === "production") await sendMail(mail);
    else if (process.env.NODE_ENV === "development")
      console.log(`sent forgotten password e-mail to ${mail.to}`, mail);

    res.status(200).json(securityCode);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
