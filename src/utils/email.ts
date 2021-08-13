import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import type { ISubscription } from "models/Subscription";
import { models } from "database";
import { SubscriptionTypes } from "models/Subscription";
import { equals } from "./string";

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const sendEventToOrgFollowers = async (
  event: IEvent,
  transport: any
) => {
  if (
    !Array.isArray(event.eventOrgs) ||
    !event.eventOrgs.length ||
    !Array.isArray(event.eventNotif) ||
    !event.eventNotif.length
  )
    return;

  const emailList = [];

  for (const org of event.eventOrgs) {
    for (const eventNotifOrgId of event.eventNotif) {
      if (eventNotifOrgId !== org._id) continue;

      for (const orgSubscription of org.orgSubscriptions) {
        const subscription = await models.Subscription.findOne({
          _id: orgSubscription
        }).populate("user");

        if (!subscription) {
          // shouldn't happen because when user remove subscription to org it is also removed from org.orgSubscriptions
          continue;
        }

        for (const { orgId, type } of subscription.orgs) {
          if (
            !equals(eventNotifOrgId, orgId) ||
            type !== SubscriptionTypes.FOLLOWER
          )
            continue;

          const email =
            typeof subscription.user === "object"
              ? subscription.user.email
              : subscription.email;
          const eventUrl = `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`;
          const mail = {
            from: process.env.EMAIL_FROM,
            to: `<${email}>`,
            subject: `${org.orgName} vous invite à un nouvel événement : ${event.eventName}`,
            html: `<h1>${org.orgName} vous invite à un nouvel événement : ${event.eventName}</h1><p>Rendez-vous sur <a href="${eventUrl}">${eventUrl}</a> pour en savoir plus.</p>`
          };

          if (process.env.NODE_ENV === "production")
            await transport.sendMail(mail);
          else if (process.env.NODE_ENV === "development") {
            console.log("mail", mail);
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
  transport: any;
}) => {
  if (!event && !org) return;

  const subject = `Nouvelle discussion : ${topic.topicName}`;
  const name = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const type = event ? "l'événement" : "l'organisation";

  for (const subscription of subscriptions) {
    let url = `${process.env.NEXT_PUBLIC_URL}/${entityUrl}`;
    let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${name}</a> pour lire la discussion.</p>`;

    if (name === "aucourant") {
      url = `${process.env.NEXT_PUBLIC_URL}/forum`;
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
    else if (process.env.NODE_ENV === "development") console.log("mail", mail);
  }
};

export const sendMessageToTopicFollowers = async ({
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
  transport: any;
}) => {
  if (!event && !org) return;

  const subject = `Nouveau commentaire sur la discussion : ${topic.topicName}`;
  const name = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const type = event ? "l'événement" : "l'organisation";

  for (const subscription of subscriptions) {
    let url = `${process.env.NEXT_PUBLIC_URL}/${entityUrl}`;
    let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${name}</a> pour lire la discussion.</p>`;

    if (name === "aucourant") {
      url = `${process.env.NEXT_PUBLIC_URL}/forum`;
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
    else if (process.env.NODE_ENV === "development") console.log("mail", mail);
  }
};

export const sendToAdmin = async (event: IEvent, transport: any) => {
  process.env.NODE_ENV === "production" &&
    (await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_ADMIN,
      subject: `Un événement attend votre approbation : ${event.eventName}`,
      html: `
        <h1>Nouvel événement : ${event.eventName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}">${process.env.NEXT_PUBLIC_SHORT_URL}/${event.eventUrl}</a> pour en savoir plus.</p>
      `
    }));
};
