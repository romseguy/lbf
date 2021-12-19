import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerError } from "utils/errors";
import {
  backgroundColor,
  Mail,
  mainBackgroundColor,
  textColor
} from "api/email";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect();

handler.post<
  NextApiRequest & { body: { email: string; message: string } },
  NextApiResponse
>(async function contact(req, res) {
  const {
    body: { email, message }
  }: { body: { email: string; message: string } } = req;

  try {
    const mail: Mail = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_ADMIN,
      subject: "Vous avez reçu un message",
      html: `
        <body style="background: ${backgroundColor};">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                <strong>${email}</strong>
              </td>
            </tr>
          </table>

          <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
            <tbody>
              <tr>
                <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  ${message}
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        `
    };

    if (process.env.NODE_ENV === "production") await transport.sendMail(mail);
    else console.log(`send message to ${mail.to}`, mail);

    res.status(200).json({});
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
