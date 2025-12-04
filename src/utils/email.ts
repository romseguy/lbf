import { addHours, parseISO } from "date-fns";
import { toDateRange } from "features/common";
import { isUser } from "models/Entity";

import { IOrg, orgTypeFull, orgTypeFull5, OrgTypes } from "models/Org";
import { ITopic } from "models/Topic";
const { getEnv } = require("utils/env");

export const mainBackgroundColor = "#dcd0ff";
export const textColor = "#444444";
export const backgroundColor = "#e6e6fa";
const descriptionBackgroundColor = "#f9f9f9";
const buttonBackgroundColor = "#346df1";
const buttonBorderColor = "#346df1";
const buttonTextColor = "#ffffff";

const linkStyle = (bold?: boolean) =>
  `text-decoration: underline; color: #15c; ${
    bold ? "font-weight: bold;" : ""
  }`;

const title = `
  <a
    href="${process.env.NEXT_PUBLIC_URL}"
    style="${linkStyle(true)}"
  >
    ${process.env.NEXT_PUBLIC_SHORT_URL}
  </a>
`;

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const getTopicUrl = ({ org, topic }: { org: IOrg; topic: ITopic }) => {
  let topicUrl = `${process.env.NEXT_PUBLIC_URL}/${org.orgUrl}`;
  topicUrl +=
    org && org.orgUrl === "forum"
      ? `/${topic.topicName}`
      : `/discussions/${topic.topicName}`;
  return topicUrl;
};

export const createTopicEmailNotif = ({
  email,
  org,
  subscriptionId,
  topic,
}: {
  email: string;
  org: IOrg;
  topic: ITopic;
  subscriptionId: string;
}) => {
  console.log("🚀 ~ topic:", topic);
  const entityName = org?.orgName;
  const entityUrl = org?.orgUrl;
  const entityType = org ? orgTypeFull(org.orgType) : "de l'événement";
  const topicUrl = getTopicUrl({ org, topic });
  const subject = `Nouvelle discussion : ${topic.topicName}`;
  const footerLink = `${process.env.NEXT_PUBLIC_URL}/unsubscribe/${org.orgUrl}?subscriptionId=${subscriptionId}`;

  return {
    from: process.env.EMAIL_FROM,
    to: `<${email}>`,
    subject,
    html: `
      <body style="background: ${backgroundColor};">
      <table width="100%">
        <tbody>
          <tr>
            <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
              ${title}
            </td>
          </tr>
        </tbody>
      </table>
      <table width="100%" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tbody>
          <tr>
            <td align="center" style="padding: 0px 12px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
              <h2 style="font-weight: bold; font-size: 1.5em; margin-block-start: 0.83em; margin-block-end: 0.83em;">${subject}</h2>
              ${
                topic.topicMessages[0]
                  ? `
                    <table width="100%" style="background: ${descriptionBackgroundColor}; border-radius: 10px;">
                      <tr>
                        <td style="padding: 12px">${topic.topicMessages[0].message}</td>
                      </tr>
                    </table>
                  `
                  : ""
              }
              <p style="margin-block-start: 1em; margin-block-end: 1em;">
                ${`${`<a href="${topicUrl}" style="${linkStyle(
                  false,
                )}">Cliquez ici</a>`} pour participer à la discussion.`}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td align="center" style="padding: 10px 0px 20px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-decoration: underline;">
              <a href="${footerLink}" style="${linkStyle(false)}">
                Se désabonner ${
                  entityUrl === "forum"
                    ? `du forum ${process.env.NEXT_PUBLIC_SHORT_URL}`
                    : `${entityType} ${entityName}`
                }
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    `,
  };
};

export const createUserPasswordResetMail = ({
  email,
  securityCode,
}: {
  email: string;
  securityCode: string;
}) => {
  const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset/${email}?code=${securityCode}`;

  return {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Réinitialiser votre mot de passe`,
    html: `
      <body style="background: ${backgroundColor};">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                <strong>${process.env.NEXT_PUBLIC_SHORT_URL}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
              <p><a href="${resetLink}">Cliquez sur ce lien pour définir un nouveau mot de passe</a></p>
              <p>Ou copiez-collez le dans votre navigateur : ${resetLink}</p>
              <p>Ce lien est valide 2h.</p>
            </td>
          </tr>
        </table>
      </body>
      `,
  };
};
