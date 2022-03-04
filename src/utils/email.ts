import { addHours, parseISO } from "date-fns";
import { toDateRange } from "features/common";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ITopic } from "models/Topic";

export const backgroundColor = "#f9f9f9";
export const textColor = "#444444";
export const mainBackgroundColor = "#ffffff";
const descriptionBackgroundColor = "#f9f9f9";
const buttonBackgroundColor = "#346df1";
const buttonBorderColor = "#346df1";
const buttonTextColor = "#ffffff";

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const getTopicUrl = ({
  org,
  event,
  topic
}: {
  org?: IOrg | null;
  event?: IEvent<string | Date>;
  topic: ITopic;
}) => {
  let topicUrl = `${process.env.NEXT_PUBLIC_URL}/${
    org ? org.orgUrl : event?.eventUrl
  }`;
  topicUrl +=
    org && org.orgUrl === "forum"
      ? `/${topic.topicName}`
      : `/discussions/${topic.topicName}`;
  return topicUrl;
};

export const createEventEmailNotif = ({
  email,
  event,
  org,
  subscriptionId
}: {
  email: string;
  event: IEvent<string | Date>;
  org: IOrg;
  subscriptionId: string;
}) => {
  const orgUrl = `${process.env.NEXT_PUBLIC_URL}/${org.orgUrl}`;
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`;
  const eventDescription = event.eventDescriptionHtml
    ? event.eventDescriptionHtml
    : undefined;
  const eventMinDate =
    typeof event.eventMinDate === "string"
      ? parseISO(event.eventMinDate)
      : event.eventMinDate;
  const eventMaxDate =
    typeof event.eventMaxDate === "string"
      ? parseISO(event.eventMaxDate)
      : event.eventMaxDate;

  return {
    from: process.env.EMAIL_FROM,
    to: `<${email}>`,
    subject: `${org.orgName} vous invite à un événement : ${event.eventName}`,
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
        <tr>
          <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            <h2>
              <a href="${orgUrl}">${
      org.orgName
    }</a> vous invite à un événement : ${event.eventName}
            </h2>
            <h3>
            ${
              process.env.NODE_ENV === "production"
                ? toDateRange(
                    addHours(eventMinDate, 2),
                    addHours(eventMaxDate, 2)
                  )
                : toDateRange(eventMinDate, eventMaxDate)
            }
            </h3>
            ${
              eventDescription
                ? `
                  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${descriptionBackgroundColor}; border-radius: 10px;">
                    <tr>
                      <td>
                        ${eventDescription}
                      </td>
                    </tr>
                  </table>
                `
                : ""
            }
            <p>Rendez-vous sur <a href="${eventUrl}?email=${email}">la page de l'événement</a> pour indiquer si vous souhaitez y participer.</p>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-decoration: underline;">
            ${`<a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${org.orgUrl}?subscriptionId=${subscriptionId}">Se désabonner de ${org.orgName}</a>`}
          </td>
        </tr>
      </table>
    </body>
    `
  };
};

export const createTopicEmailNotif = ({
  email,
  event,
  org,
  subscriptionId,
  topic
}: {
  email: string;
  event?: IEvent<string | Date>;
  org?: IOrg;
  topic: ITopic;
  subscriptionId: string;
}) => {
  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const entityType = org ? orgTypeFull(org.orgType) : "de l'événement";
  const topicUrl = getTopicUrl({ event, org, topic });
  const subject = `Vous êtes invité à une discussion : ${topic.topicName}`;

  return {
    from: process.env.EMAIL_FROM,
    to: `<${email}>`,
    subject,
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
        <tr>
          <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            <h2>${subject}</h2>
            ${
              topic.topicMessages[0]
                ? `
                  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${descriptionBackgroundColor}; border-radius: 10px;">
                    <tr>
                      <td>
                        ${topic.topicMessages[0].messageHtml}
                      </td>
                    </tr>
                  </table>
                `
                : ""
            }
            <p><a href="${topicUrl}">Cliquez ici</a> pour participer à la discussion.</p>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-decoration: underline;">
            ${`
              <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${
              org ? org.orgUrl : event?.eventUrl
            }?subscriptionId=${subscriptionId}">Se désabonner ${
              entityUrl === "forum"
                ? `du forum ${process.env.NEXT_PUBLIC_SHORT_URL}`
                : `${entityType} ${entityName}`
            }</a>
            `}
          </td>
        </tr>
      </table>
    </body>
    `
  };
};
