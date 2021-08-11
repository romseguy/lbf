import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { emailR } from "utils/email";
import { randomNumber } from "utils/randomNumber";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.post<NextApiRequest, NextApiResponse>(async function forgotten(
  req,
  res
) {
  const {
    body: { email, password }
  } = req;

  try {
    if (emailR.test(email)) {
      if (password) {
        const { n, nModified } = await models.User.updateOne(
          { email },
          { password }
        );

        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error("Le mot de passe n'a pas pu être modifié")
              )
            );
        }
      } else {
        const securityCode = randomNumber(6);

        const { n, nModified } = await models.User.updateOne(
          { email },
          { securityCode }
        );

        if (nModified === 1) {
          const mail = {
            from: process.env.EMAIL_FROM,
            to: `<${email}>`,
            subject: `${securityCode} est votre code de sécurité ${process.env.NEXT_PUBLIC_SHORT_URL}`,
            html: `<h1>Votre demande de réinitialisation de mot de passe</h1>Afin de réinitialiser votre mot de passse, veuillez saisir le code de sécurité suivant : ${securityCode}`
          };
          if (process.env.NODE_ENV === "production")
            await transport.sendMail(mail);
          else if (process.env.NODE_ENV === "development")
            console.log("mail", mail);

          res.status(200).json(securityCode);
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error("Cette adresse e-mail ne correspond à aucun compte")
              )
            );
        }
      }
    } else {
      res.status(400).json({ email: "Cette adresse e-mail est invalide" });
    }
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
