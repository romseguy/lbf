import { addHours, parseISO } from "date-fns";
import nodemailer from "nodemailer";
import { models } from "database";
import { toDateRange } from "features/common";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { IProject } from "models/Project";
import { ITopic } from "models/Topic";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import api from "utils/api";
import { equals, logJson } from "utils/string";
import { Document } from "mongoose";

export const backgroundColor = "#f9f9f9";
export const textColor = "#444444";
export const mainBackgroundColor = "#ffffff";
const descriptionBackgroundColor = "#f9f9f9";
const buttonBackgroundColor = "#346df1";
const buttonBorderColor = "#346df1";
const buttonTextColor = "#ffffff";

export type Mail = {
  from?: string;
  subject?: string;
  to?: string;
  html?: string;
};

const getTopicUrl = ({
  org,
  event,
  topic
}: {
  org?: IOrg | null;
  event?: IEvent | null;
  topic: ITopic;
}) => {
  let topicUrl = `${process.env.NEXT_PUBLIC_URL}/${
    org ? (org.orgUrl === "forum" ? "forum" : org.orgUrl) : event?.eventUrl
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
  subscription,
  isPreview
}: {
  email: string;
  event: IEvent;
  org: IOrg;
  subscription: ISubscription | null;
  isPreview?: boolean;
}): Mail => {
  const orgUrl = `${process.env.NEXT_PUBLIC_URL}/${org.orgUrl}`;
  const eventUrl = `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`;
  const eventDescription = event.eventDescriptionHtml
    ? event.eventDescriptionHtml
    : undefined;

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
                    addHours(parseISO(event.eventMinDate), 2),
                    addHours(parseISO(event.eventMaxDate), 2)
                  )
                : toDateRange(
                    parseISO(event.eventMinDate),
                    parseISO(event.eventMaxDate)
                  )
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

// send email and/or push notifications to org followers
// who chose to be notified when :
// - new events
// - or events belonging to specific categories
// are added to the org
export const sendEventNotifications = async ({
  event,
  org,
  subscriptions,
  transport
}: {
  event: IEvent & Document<any, any, IEvent>;
  org: IOrg;
  subscriptions: ISubscription[];
  transport: nodemailer.Transporter<any>;
}): Promise<string[]> => {
  const emailList: string[] = [];

  if (!subscriptions.length) {
    console.log(`sendEventNotifications: no subscriptions`);
    return [];
  }

  for (const subscription of subscriptions) {
    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    const orgSubscription = subscription.orgs?.find(
      ({ orgId, type }) =>
        equals(orgId, org._id) && type === SubscriptionTypes.FOLLOWER
    );

    if (!orgSubscription) continue;

    if (orgSubscription.eventCategories) {
      const eventCategoriesEmail = orgSubscription.eventCategories.filter(
        ({ emailNotif }) => emailNotif
      );

      if (
        eventCategoriesEmail.find(
          (eventCategory) =>
            eventCategory.catId === event.eventCategory &&
            eventCategory.emailNotif
        )
      ) {
        if (!email || event.eventNotified?.find(({ email: e }) => e === email))
          continue;

        const mail = createEventEmailNotif({
          email,
          event,
          org,
          subscription
        });

        if (process.env.NODE_ENV === "production")
          await transport.sendMail(mail);
        else if (process.env.NODE_ENV === "development") {
          console.log(`sent event email notif to ${mail.to}`, mail);
        }

        emailList.push(email);
      }

      const eventCategoriesPush = orgSubscription.eventCategories.filter(
        ({ pushNotif }) => pushNotif
      );

      if (
        eventCategoriesPush.find(
          (eventCategory) =>
            eventCategory.catId === event.eventCategory &&
            eventCategory.pushNotif
        )
      ) {
        const user = await models.User.findOne({ email });

        if (user && user.userSubscription)
          await api.sendPushNotification({
            message: `Appuyez pour ouvrir la page de l'événement`,
            subscription: user.userSubscription,
            title: `Vous êtes invité à un événement`,
            url: event.eventUrl
          });
      }
    } else {
      const tagType = orgSubscription.tagTypes?.find(
        ({ type }) => type === "Events"
      );

      if (!tagType) continue;

      if (tagType.emailNotif) {
        if (!email || event.eventNotified?.find(({ email: e }) => e === email))
          continue;

        const mail = createEventEmailNotif({
          email,
          event,
          org,
          subscription
        });

        if (process.env.NODE_ENV === "production")
          await transport.sendMail(mail);
        else if (process.env.NODE_ENV === "development") {
          console.log(`sent event email notif to ${mail.to}`, mail);
        }

        emailList.push(email);
      }

      if (tagType.pushNotif) {
        if (!subscription.user) continue;

        const user = await models.User.findOne({
          _id:
            typeof subscription.user === "string"
              ? subscription.user
              : subscription.user._id
        });

        if (user && user.userSubscription) {
          await api.sendPushNotification({
            message: `Appuyez pour ouvrir la page de l'événement`,
            subscription: user.userSubscription,
            title: "Vous êtes invité à un événement",
            url: event.eventUrl
          });
        }
      }
    }
  }

  event.eventNotified = emailList.map((email) => ({ email }));
  await event.save();

  return emailList;
};

export const createTopicEmailNotif = ({
  email,
  event,
  org,
  subscription,
  topic
}: {
  email: string;
  event?: IEvent;
  org?: IOrg;
  topic: ITopic;
  subscription: ISubscription | null;
}): Mail => {
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
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            ${`
              <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${
              org ? org.orgUrl : event?.eventUrl
            }?subscriptionId=${
              subscription ? subscription._id : "foo"
            }">Se désabonner ${
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

// send email and/or push notifications to org or event followers
// who chose to be notified when new topics are added to the org or event
export const sendTopicNotifications = async ({
  event,
  org,
  subscriptions,
  topic,
  transport
}: {
  event?: IEvent;
  org?: IOrg;
  subscriptions: ISubscription[];
  topic: ITopic & Document<any, any, ITopic>;
  transport: nodemailer.Transporter<any>;
}): Promise<string[]> => {
  const emailList: string[] = [];

  if (!event && !org) {
    logJson(`sendTopicNotifications: neither org or event`);
    return [];
  }

  for (let subscription of subscriptions) {
    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;
    if (org) {
      const orgSubscription = subscription.orgs?.find(
        ({ orgId, type }) =>
          equals(orgId, org._id) && type === SubscriptionTypes.FOLLOWER
      );
      console.log(orgSubscription);

      if (!orgSubscription) continue;

      const tagType = orgSubscription.tagTypes?.find(
        ({ type }) => type === "Topics"
      );

      if (!tagType) continue;

      if (tagType.emailNotif) {
        if (!email || topic.topicNotified?.find(({ email: e }) => e === email))
          continue;

        const mail = createTopicEmailNotif({
          email,
          org,
          subscription,
          topic
        });

        if (process.env.NODE_ENV === "production")
          await transport.sendMail(mail);
        else if (process.env.NODE_ENV === "development") {
          console.log(`sent topic email notif to ${mail.to}`, mail);
        }

        emailList.push(email);
      }

      if (
        process.env.NODE_ENV === "production" &&
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire la discussion`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à une discussion",
            url: getTopicUrl({ org, topic })
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (event) {
      const eventSubscription = subscription.events?.find(({ eventId }) =>
        equals(eventId, event._id)
      );

      if (!eventSubscription) continue;

      const tagType = eventSubscription.tagTypes?.find(
        ({ type }) => type === "Topics"
      );

      if (!tagType) continue;

      if (tagType.emailNotif) {
        if (!email || topic.topicNotified?.find(({ email: e }) => e === email))
          continue;

        const mail = createTopicEmailNotif({
          email,
          event,
          subscription,
          topic
        });

        if (process.env.NODE_ENV === "production")
          await transport.sendMail(mail);
        else if (process.env.NODE_ENV === "development") {
          console.log(`sent topic email notif to ${mail.to}`, mail);
        }

        emailList.push(email);
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire la discussion`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à une discussion",
            url: getTopicUrl({ event, topic })
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  const topicNotified = emailList.map((email) => ({ email }));
  if (topic.topicNotified) {
    topic.topicNotified = topic.topicNotified.concat(topicNotified);
  } else {
    topic.topicNotified = topicNotified;
  }
  await topic.save();

  return emailList;
};

// send new topic message email and/or push notifications to topic followers
export const sendTopicMessageEmailNotifications = async ({
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
  transport: nodemailer.Transporter<any>;
}) => {
  if (!event && !org) return;

  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const subject = `Nouveau commentaire sur la discussion : ${topic.topicName}`;
  const type = event ? "l'événement" : "l'organisation";
  const url = getTopicUrl({ event, org, topic });

  for (const subscription of subscriptions) {
    let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${entityName}</a> pour lire la discussion.</p>
    <p><a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}&topicId=${topic._id}">Se désabonner de cette discussion</a></p>
    <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${entityName}</a>
    `;

    if (entityName === "forum") {
      html = `<h1>${subject}</h1><p>Rendez-vous sur le <a href="${url}">forum</a> pour lire la discussion.</p>`;
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
      console.log(`sent topic message email notif to ${email}`, mail);
    }
  }
};

export const sendToAdmin = async ({
  event,
  project,
  transport
}: {
  event?: IEvent;
  project?: Partial<IProject>;
  transport: nodemailer.Transporter<any>;
}) => {
  if (!event && !project) return;

  let mail: Mail = {
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
  } else if (project && project.projectOrgs) {
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
    console.log(`sent project email notif to ${mail.to}`, mail);
  }
};

// export const sendEventToOrgFollowers = async (
//   event: IEvent,
//   orgIds: string[],
//   transport: nodemailer.Transporter<any>
// ) => {
//   // console.log("sending notifications to event", event);

//   const emailList: string[] = [];

//   if (!event.isApproved) {
//     throw new Error("L'événément doit être approuvé");
//   }

//   if (!Array.isArray(event.eventOrgs)) {
//     throw new Error("L'événement est organisé par aucune organisation");
//   }

//   if (!Array.isArray(orgIds) || !orgIds.length) {
//     throw new Error("Aucune organisation spécifiée");
//   }

//   for (const org of event.eventOrgs) {
//     const orgId = typeof org === "object" ? org._id : org;

//     for (const notifOrgId of orgIds) {
//       if (!equals(notifOrgId, orgId)) continue;

//       //console.log("notifying followers from org", org);

//       for (const orgSubscription of org.orgSubscriptions) {
//         const subscription = await models.Subscription.findOne({
//           _id:
//             typeof orgSubscription === "object"
//               ? orgSubscription._id
//               : orgSubscription
//         }).populate("user");

//         if (!subscription) {
//           // shouldn't happen because when user remove subscription to org it is also removed from org.orgSubscriptions
//           continue;
//         }

//         if (subscription.orgs)
//           for (const {
//             orgId,
//             type,
//             eventCategories = []
//           } of subscription.orgs) {
//             if (
//               !equals(notifOrgId, orgId) ||
//               type !== SubscriptionTypes.FOLLOWER
//             )
//               continue;

//             const email =
//               typeof subscription.user === "object"
//                 ? subscription.user.email
//                 : subscription.email;

//             if (subscription.phone) {
//               // todo
//             } else if (email) {
//               if (
//                 Array.isArray(event.eventNotified) &&
//                 event.eventNotified.find((m) => m.email === email)
//               )
//                 continue;

//               const user = await models.User.findOne({ email });
//               const eventCategoriesEmail = eventCategories.filter(
//                 ({ emailNotif }) => emailNotif
//               );
//               const eventCategoriesPush = eventCategories.filter(
//                 ({ pushNotif }) => pushNotif
//               );

//               if (
//                 user &&
//                 user.userSubscription &&
//                 (eventCategoriesPush.length === 0 ||
//                   !!eventCategoriesPush.find(
//                     (eventCategory) =>
//                       eventCategory.catId === event.eventCategory &&
//                       eventCategory.pushNotif
//                   ))
//               ) {
//                 await api.post("notification", {
//                   subscription: user.userSubscription,
//                   notification: {
//                     title: `Invitation à un événement`,
//                     message: event.eventName,
//                     url: `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`
//                   }
//                 });
//               }

//               if (
//                 eventCategoriesEmail.length > 0 &&
//                 !eventCategoriesEmail.find(
//                   (eventCategory) =>
//                     eventCategory.catId === event.eventCategory &&
//                     eventCategory.emailNotif
//                 )
//               )
//                 continue;

//               const mail = createEventEmailNotif({
//                 email,
//                 event,
//                 org,
//                 subscription
//               });

//               if (process.env.NODE_ENV === "production") {
//                 try {
//                   const res = await axios.post(
//                     process.env.NEXT_PUBLIC_API2 + "/mail",
//                     {
//                       eventId: event._id,
//                       mail
//                     }
//                   );
//                   console.log(
//                     `sent event email notif to subscriber ${res.data.email}`,
//                     mail
//                   );
//                 } catch (error: any) {
//                   console.log(`error sending mail to ${email}`);
//                   console.error(error);
//                   continue;
//                 }
//               } else if (process.env.NODE_ENV === "development") {
//                 console.log(
//                   `sent event email notif to subscriber ${email}`,
//                   mail
//                 );
//               }

//               emailList.push(email);
//             }
//           }
//       }
//     }
//   }

//   return emailList;
// };
