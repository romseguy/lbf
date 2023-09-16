//@ts-nocheck
import { isBefore, addDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { sendMail } from "server/email";
import { getSession } from "utils/auth";
import { backgroundColor, textColor, mainBackgroundColor } from "utils/email";
import { createServerError } from "utils/errors";

const handler = nextConnect();

handler.post<NextApiRequest & { body: { category: string } }, NextApiResponse>(
  async function suggestCategory(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(createServerError(new Error("Vous devez être identifié.")));
    }

    if (
      session.user.suggestedCategoryAt &&
      isBefore(
        new Date(),
        addDays(parseISO(session.user.suggestedCategoryAt), 1)
      )
    )
      return res
        .status(403)
        .json(
          createServerError(
            new Error(
              `Vous devez attendre le ${format(
                parseISO(session.user.suggestedCategoryAt),
                "cccc d MMMM H'h'mm",
                { locale: fr }
              )} pour proposer une nouvelle catégorie`
            )
          )
        );

    let {
      body: { category }
    }: { body: { category: string } } = req;

    if (typeof category !== "string")
      return res
        .status(400)
        .json(
          createServerError(
            new Error("La catégorie doit être une chaine de caractères")
          )
        );

    try {
      const mail = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_ADMIN,
        subject: "Une nouvelle catégorie a été suggérée",
        html: `
        <body style="background: ${backgroundColor};">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                <strong>${process.env.NEXT_PUBLIC_SHORT_URL}</strong>
              </td>
            </tr>
          </table>

          <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
            <tbody>
              <tr>
                <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  <h2>Une nouvelle catégorie a été suggérée : ${category}</h2>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        `
      };

      await sendMail(mail);
      res.status(200).json({});
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
