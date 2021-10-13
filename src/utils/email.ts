import axios from "axios";
import { addHours, parseISO } from "date-fns";
import nodemailer from "nodemailer";
import { models } from "database";
import { toDateRange } from "features/common";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IProject } from "models/Project";
import { ITopic } from "models/Topic";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import api from "./api";
import { equals } from "./string";

type MailType = {
  from?: string;
  subject?: string;
  to?: string;
  html?: string;
};

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Some simple styling options
const backgroundColor = "#f9f9f9";
const textColor = "#444444";
const mainBackgroundColor = "#ffffff";
const buttonBackgroundColor = "#346df1";
const buttonBorderColor = "#346df1";
const buttonTextColor = "#ffffff";

export const createEventNotifEmail = ({
  email,
  event,
  org,
  subscription,
  isPreview
}: {
  email: string;
  event: IEvent;
  org: IOrg;
  subscription: ISubscription | null;
  isPreview?: boolean;
}) => {
  const orgUrl = `${process.env.NEXT_PUBLIC_URL}/${org.orgUrl}`;
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`;

  return {
    from: process.env.EMAIL_FROM,
    to: `<${email}>`,
    subject: `${org.orgName} vous invite à un nouvel événement : ${event.eventName}`,
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
    }</a> vous invite à un nouvel événement : ${event.eventName}
            </h2>

            <h3>
            ${
              process.env.NODE_ENV === "production"
                ? toDateRange(
                    addHours(parseISO(event.eventMinDate), 2),
                    addHours(parseISO(event.eventMaxDate), 2)
                  )
                : toDateRange(
                    parseISO(event.eventMinDate),
                    parseISO(event.eventMaxDate)
                  )
            }
            </h3>

            <p>Rendez-vous sur <a href="${eventUrl}?email=${email}">la page de l'événement</a> pour voir la description complète de l'événement et indiquer si vous souhaitez y participer.</p>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            ${
              isPreview
                ? `
                  <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${
                    org.orgUrl
                  }?subscriptionId=${
                    subscription ? subscription._id : "foo"
                  }">Se désabonner de ${org.orgName}</a>
                  `
                : subscription
                ? `
                  <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${org.orgUrl}?subscriptionId=${subscription._id}">Se désabonner de ${org.orgName}</a>
                  `
                : ""
            }
          </td>
        </tr>
      </table>
    </body>
    `
  };
};

export const sendEventToOrgFollowers = async (
  event: IEvent,
  orgIds: string[],
  transport: nodemailer.Transporter<any>
) => {
  // console.log("sending notifications to event", event);

  const emailList: string[] = [];

  if (!event.isApproved) {
    throw new Error("L'événément doit être approuvé");
  }

  if (!Array.isArray(event.eventOrgs)) {
    throw new Error("L'événement est organisé par aucune organisation");
  }

  if (!Array.isArray(orgIds) || !orgIds.length) {
    throw new Error("Aucune organisation spécifiée");
  }

  for (const org of event.eventOrgs) {
    //console.log("notifying followers from org", org);
    const orgId = typeof org === "object" ? org._id : org;

    for (const notifOrgId of orgIds) {
      if (!equals(notifOrgId, orgId)) continue;

      for (const orgSubscription of org.orgSubscriptions) {
        const subscription = await models.Subscription.findOne({
          _id: orgSubscription
        }).populate("user");

        if (!subscription) {
          // shouldn't happen because when user remove subscription to org it is also removed from org.orgSubscriptions
          continue;
        }

        for (const { orgId, type, eventCategories = [] } of subscription.orgs) {
          if (!equals(notifOrgId, orgId) || type !== SubscriptionTypes.FOLLOWER)
            continue;

          const email =
            typeof subscription.user === "object"
              ? subscription.user.email
              : subscription.email;

          if (!email) continue;

          if (
            Array.isArray(event.eventNotified) &&
            event.eventNotified.find((m) => m.email === email)
          )
            continue;

          const user = await models.User.findOne({ email });
          const eventCategoriesEmail = eventCategories.filter(
            ({ emailNotif }) => emailNotif
          );
          const eventCategoriesPush = eventCategories.filter(
            ({ pushNotif }) => pushNotif
          );

          if (
            user &&
            user.userSubscription &&
            (eventCategoriesPush.length === 0 ||
              !!eventCategoriesPush.find(
                (eventCategory) =>
                  eventCategory.catId === event.eventCategory &&
                  eventCategory.pushNotif
              ))
          ) {
            await api.post("notification", {
              subscription: user.userSubscription,
              notification: {
                title: `Invitation à un événement`,
                message: event.eventName,
                url: `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`
              }
            });
          }

          if (
            eventCategoriesEmail.length > 0 &&
            !eventCategoriesEmail.find(
              (eventCategory) =>
                eventCategory.catId === event.eventCategory &&
                eventCategory.emailNotif
            )
          )
            continue;

          const mail = createEventNotifEmail({
            email,
            event,
            org,
            subscription
          });

          if (process.env.NODE_ENV === "production") {
            try {
              const res = await axios.post(
                process.env.NEXT_PUBLIC_API2 + "/mail",
                {
                  eventId: event._id,
                  mail
                }
              );
              console.log(
                `sent event email notif to subscriber ${res.data.email}`,
                mail
              );
            } catch (error: any) {
              console.log(`error sending mail to ${email}`);
              console.error(error);
              continue;
            }
          } else if (process.env.NODE_ENV === "development") {
            console.log(`sent event email notif to subscriber ${email}`, mail);
          }

          emailList.push(email);
        }
      }
    }
  }

  return emailList;
};

export const sendTopicToFollowers = async ({
  event,
  org,
  subscriptions,
  topic,
  transport
}: {
  event?: IEvent;
  org?: IOrg;
  subscriptions: ISubscription[];
  topic: ITopic;
  transport: nodemailer.Transporter<any>;
}) => {
  const emailList: string[] = [];

  if (!event && !org) return emailList;

  if (!subscriptions.length) {
    console.log(`nobody subscribed to this ${org ? "org" : "event"}`);
    return emailList;
  }

  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const subject = `Nouvelle discussion : ${topic.topicName}`;
  const type = event ? "l'événement" : "l'organisation";
  const url =
    entityName === "aucourant"
      ? `${process.env.NEXT_PUBLIC_URL}/forum`
      : `${process.env.NEXT_PUBLIC_URL}/${entityUrl}`;

  let mail: MailType = {
    from: process.env.EMAIL_FROM,
    subject
  };

  for (const subscription of subscriptions) {
    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    if (!email) continue;

    if (topic.topicNotified?.find(({ email: e }) => e === email)) continue;

    mail.to = `<${email}>`;

    mail.html = `
    <h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${entityName}</a> pour lire la discussion.</p>
    <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${type} ${entityName}</a>
    `;

    if (process.env.NODE_ENV === "production") await transport.sendMail(mail);
    else if (process.env.NODE_ENV === "development") {
      console.log(`sent new topic email notif to subscriber ${email}`, mail);
    }

    emailList.push(email);
  }

  return emailList;
};

export const sendMessageToTopicFollowers = async ({
  event,
  org,
  subscriptions,
  topic,
  transport
}: {
  event?: IEvent | null;
  org?: IOrg | null;
  subscriptions: ISubscription[];
  topic: ITopic;
  transport: any;
}) => {
  if (!event && !org) return;

  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const subject = `Nouveau commentaire sur la discussion : ${topic.topicName}`;
  const type = event ? "l'événement" : "l'organisation";
  const url =
    entityName === "aucourant"
      ? `${process.env.NEXT_PUBLIC_URL}/forum`
      : `${process.env.NEXT_PUBLIC_URL}/${entityUrl}`;

  for (const subscription of subscriptions) {
    let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${entityName}</a> pour lire la discussion.</p>
    <p><a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}&topicId=${topic._id}">Se désabonner de cette discussion</a></p>
    <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${entityName}</a>
    `;

    if (entityName === "aucourant") {
      html = `<h1>${subject}</h1><p>Rendez-vous sur le forum de <a href="${url}">${process.env.NEXT_PUBLIC_SHORT_URL}</a> pour lire la discussion.</p>`;
    }

    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    if (!email) continue;

    const mail = {
      from: process.env.EMAIL_FROM,
      to: `<${email}>`,
      subject,
      html
    };

    if (process.env.NODE_ENV === "production") await transport.sendMail(mail);
    else if (process.env.NODE_ENV === "development") {
      console.log("sent comment email notif to subscription", mail);
    }
  }
};

export const sendToAdmin = async ({
  event,
  project,
  transport
}: {
  event?: IEvent;
  project?: IProject;
  transport: any;
}) => {
  if (!event && !project) return;

  let mail: MailType = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN
  };

  if (event) {
    if (event.isApproved) return;

    mail = {
      ...mail,
      subject: `Un événement attend votre approbation : ${event.eventName}`,
      html: `
        <h1>Nouvel événement : ${event.eventName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}">${process.env.NEXT_PUBLIC_SHORT_URL}/${event.eventUrl}</a> pour l'approuver.</p>
      `
    };
  } else if (project) {
    mail = {
      ...mail,
      subject: `Un projet attend votre approbation : ${project.projectName}`,
      html: `
        <h1>Nouveau projet : ${project.projectName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXT_PUBLIC_URL}/${project.projectOrgs[0].orgName}">${process.env.NEXT_PUBLIC_SHORT_URL}/${project.projectOrgs[0].orgName}</a> pour l'approuver.</p>
      `
    };
  }

  if (process.env.NODE_ENV === "production") {
    await transport.sendMail(mail);
  } else if (process.env.NODE_ENV === "development") {
    console.log("mail", mail);
  }
};
