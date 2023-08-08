import { Document } from "mongoose";
import nodemailer, { SendMailOptions as Mail } from "nodemailer";
import { models } from "database";
import { IEvent, EEventInviteStatus } from "models/Event";
import {
  IEventNotification,
  IProjectNotification,
  ITopicNotification
} from "models/INotification";
import { IOrg } from "models/Org";
import { EProjectInviteStatus, IProject } from "models/Project";
import { EOrgSubscriptionType, ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import api from "utils/api";
import { Session } from "utils/auth";
import {
  createEventEmailNotif,
  createProjectEmailNotif,
  createTopicEmailNotif,
  getProjectUrl,
  getTopicUrl
} from "utils/email";
import { equals, logJson } from "utils/string";

export const sendMail = async (mail: Mail, session?: Session | null) => {
  try {
    const server = {
      pool: true,
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: "rom.seguy@lilo.org",
        pass: "hQj2dKDg0ML5yHNZ"
      }
    };

    if (process.env.NODE_ENV === "production") {
      const transport = nodemailer.createTransport(server);
      await transport.sendMail(mail);
    }

    console.log(`sent notif to ${mail.to}`, mail);

    if (session)
      await models.User.updateOne(
        { userId: session.user.userId },
        { emailCount: "increment" }
      );
  } catch (error: any) {
    console.log("api/email/sendMail error");
    console.error(error);

    if (process.env.NODE_ENV === "development") {
      if (error.command === "CONN") {
        console.log(`sent email to ${mail.to}`, mail);

        if (session)
          await models.User.updateOne(
            { userId: session.user.userId },
            { emailCount: "increment" }
          );
      }
    } else throw error;
  }
};

// send email and/or push notifications to org followers
// who chose to be notified when :
// - new events
// - or events belonging to specific categories
// are added to the org
export const sendEventNotifications = async ({
  event,
  org,
  subscriptions
}: {
  event: IEvent & Document<any, IEvent>;
  org: IOrg;
  subscriptions: ISubscription[];
}): Promise<IEventNotification[]> => {
  const eventNotifications: IEventNotification[] = [];

  if (!subscriptions.length) {
    console.log(`sendEventNotifications: no subscriptions`);
    return [];
  }

  for (const subscription of subscriptions) {
    logJson(`sendEventNotifications: subscription`, subscription);

    let eventNotification: IEventNotification = {
      status: EEventInviteStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    const orgSubscription = subscription.orgs?.find(
      ({ orgId, type }) =>
        equals(orgId, org._id) && type === EOrgSubscriptionType.FOLLOWER
    );

    if (!orgSubscription) {
      console.log(
        "sendEventNotifications: skipping -- no follower subscription"
      );
      continue;
    }

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
        if (
          !email ||
          event.eventNotifications.find(({ email: e }) => e === email)
        )
          continue;

        const mail = createEventEmailNotif({
          email,
          event,
          org,
          subscriptionId: subscription._id
        });

        await sendMail(mail);
        eventNotification = { ...eventNotification, email };
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

      if (!tagType) {
        console.log("sendEventNotifications: skipping -- no tag type");
        continue;
      }

      if (tagType.emailNotif) {
        if (email) {
          console.log(`email: notifying ${email}`);

          if (event.eventNotifications.find(({ email: e }) => e === email)) {
            console.log("email: skipping -- email already notified");
          } else {
            const mail = createEventEmailNotif({
              email,
              event,
              org,
              subscriptionId: subscription._id
            });

            await sendMail(mail);
            eventNotification = { ...eventNotification, email };
          }
        }
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        console.log(`push: user ${subscription.user._id}`);

        if (
          event.eventNotifications.find(({ user }) =>
            typeof subscription.user === "object"
              ? equals(user, subscription.user._id)
              : equals(user, subscription.user)
          )
        ) {
          console.log("push: skipping -- user already notified");
        } else {
          try {
            await api.sendPushNotification({
              message: `Appuyez pour ouvrir la page de l'événement`,
              subscription: subscription.user.userSubscription,
              title: "Vous êtes invité à un événement",
              url: event.eventUrl
            });

            eventNotification = {
              ...eventNotification,
              user: subscription.user._id
            };
          } catch (error) {
            console.error(error);
            if (process.env.NODE_ENV !== "production")
              eventNotification = {
                ...eventNotification,
                user: subscription.user._id
              };
          }
        }
      }
    }

    eventNotifications.push(eventNotification);
  }

  event.eventNotifications =
    event.eventNotifications.concat(eventNotifications);
  await event.save();

  return eventNotifications;
};

// send email and/or push notifications to org or event followers
// who chose to be notified when new projects are added to the org or event
export const sendProjectNotifications = async ({
  event,
  org,
  subscriptions,
  project
}: {
  event?: IEvent;
  org?: IOrg;
  subscriptions: ISubscription[];
  project: IProject & Document<any, IProject>;
}): Promise<IProjectNotification[]> => {
  const projectNotifications: IProjectNotification[] = [];

  if (!event && !org) {
    console.log("sendProjectNotifications: neither org or event");
    return [];
  }

  for (let subscription of subscriptions) {
    logJson(`sendProjectNotifications: subscription`, subscription);

    let projectNotification: IProjectNotification = {
      status: EProjectInviteStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    if (org) {
      const orgSubscription = subscription.orgs?.find(
        ({ orgId, type }) =>
          equals(orgId, org._id) && type === EOrgSubscriptionType.FOLLOWER
      );

      if (!orgSubscription) {
        console.log(
          "sendProjectNotifications: skipping -- no follower subscription"
        );
        continue;
      }

      const tagType = orgSubscription.tagTypes?.find(
        ({ type }) => type === "Projects"
      );

      if (!tagType) {
        console.log("sendProjectNotifications: skipping -- no tag type");
        continue;
      }

      if (tagType.emailNotif) {
        if (email) {
          console.log(`email: notifying ${email}`);

          if (
            project.projectNotifications.find(({ email: e }) => e === email)
          ) {
            console.log(
              "sendProjectNotifications: skipping -- email already notified"
            );
            continue;
          }

          const mail = createProjectEmailNotif({
            email,
            org,
            subscriptionId: subscription._id,
            project
          });

          await sendMail(mail);
          projectNotifications.push({ ...projectNotification, email });
        }
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        console.log(`push: user ${subscription.user._id}`);

        if (
          project.projectNotifications.find(({ user }) =>
            typeof subscription.user === "object"
              ? equals(user, subscription.user._id)
              : equals(user, subscription.user)
          )
        ) {
          console.log("push: skipping -- user already notified");
          continue;
        }

        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire le projet`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à un projet",
            url: getProjectUrl({ org, project })
          });

          projectNotifications.push({
            ...projectNotification,
            user: subscription.user._id
          });
        } catch (error) {
          console.error(error);
          if (process.env.NODE_ENV !== "production")
            projectNotifications.push({
              ...projectNotification,
              user: subscription.user._id
            });
        }
      }
    } else if (event) {
      const eventSubscription = subscription.events?.find(({ eventId }) =>
        equals(eventId, event._id)
      );

      if (!eventSubscription) {
        console.log(
          "sendProjectNotifications: skipping -- no event subscription"
        );
        continue;
      }

      const tagType = eventSubscription.tagTypes?.find(
        ({ type }) => type === "Projects"
      );

      if (!tagType) {
        console.log("sendProjectNotifications: skipping -- no tag type");
        continue;
      }

      if (tagType.emailNotif) {
        if (email) {
          console.log(`email: notifying ${email}`);

          if (
            project.projectNotifications.find(({ email: e }) => e === email)
          ) {
            console.log("email: skipping -- already notified");
          } else {
            const mail = createProjectEmailNotif({
              email,
              event,
              subscriptionId: subscription._id,
              project
            });

            await sendMail(mail);
            projectNotifications.push({ ...projectNotification, email });
          }
        }
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        console.log(`push: user ${subscription.user._id}`);

        if (
          project.projectNotifications.find(({ user }) =>
            typeof subscription.user === "object"
              ? equals(user, subscription.user._id)
              : equals(user, subscription.user)
          )
        ) {
          console.log("push: skipping -- user already notified");
          continue;
        }

        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire le projet`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à un projet",
            url: getProjectUrl({ event, project })
          });
          projectNotifications.push({
            ...projectNotification,
            user: subscription.user._id
          });
        } catch (error) {
          console.error(error);
          if (process.env.NODE_ENV !== "production")
            projectNotifications.push({
              ...projectNotification,
              user: subscription.user._id
            });
        }
      }
    }
  }

  project.projectNotifications =
    project.projectNotifications.concat(projectNotifications);
  await project.save();

  return projectNotifications;
};

// send email and/or push notifications to org or event followers
// who chose to be notified when new topics are added to the org or event
export const sendTopicNotifications = async ({
  event,
  org,
  subscriptions,
  topic
}: {
  event?: IEvent;
  org?: IOrg;
  subscriptions: ISubscription[];
  topic: ITopic & Document<any, ITopic>;
}): Promise<ITopicNotification[]> => {
  const topicNotifications: ITopicNotification[] = [];

  if (!event && !org) {
    console.log("sendTopicNotifications: neither org or event");
    return [];
  }

  for (let subscription of subscriptions) {
    logJson(`sendTopicNotifications: subscription`, subscription);

    let topicNotification: ITopicNotification = {
      createdAt: new Date().toISOString()
    };

    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    if (org) {
      const orgSubscription = subscription.orgs?.find(
        ({ orgId, type }) =>
          equals(orgId, org._id) && type === EOrgSubscriptionType.FOLLOWER
      );

      if (!orgSubscription) {
        console.log(
          "sendTopicNotifications: skipping -- no follower subscription"
        );
        continue;
      }

      const tagType = orgSubscription.tagTypes?.find(
        ({ type }) => type === "Topics"
      );

      if (!tagType) {
        console.log("sendTopicNotifications: skipping -- no tag type");
        continue;
      }

      if (tagType.emailNotif) {
        if (email) {
          console.log(`email: notifying ${email}`);

          if (topic.topicNotifications.find(({ email: e }) => e === email)) {
            console.log(
              "sendTopicNotifications: skipping -- email already notified"
            );
            continue;
          }

          const mail = createTopicEmailNotif({
            email,
            org,
            subscriptionId: subscription._id,
            topic
          });

          await sendMail(mail);
          topicNotification = { ...topicNotification, email };
        }
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        console.log(`push: user ${subscription.user._id}`);

        if (
          topic.topicNotifications.find(({ user }) =>
            typeof subscription.user === "object"
              ? equals(user, subscription.user._id)
              : equals(user, subscription.user)
          )
        ) {
          console.log("push: skipping -- user already notified");
          continue;
        }

        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire la discussion`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à une discussion",
            url: getTopicUrl({ org, topic })
          });

          topicNotification = {
            ...topicNotification,
            user: subscription.user._id
          };
        } catch (error) {
          console.error(error);
          if (process.env.NODE_ENV !== "production")
            topicNotification = {
              ...topicNotification,
              user: subscription.user._id
            };
        }
      }
    } else if (event) {
      const eventSubscription = subscription.events?.find(({ eventId }) =>
        equals(eventId, event._id)
      );

      if (!eventSubscription) {
        console.log(
          "sendTopicNotifications: skipping -- no event subscription"
        );
        continue;
      }

      const tagType = eventSubscription.tagTypes?.find(
        ({ type }) => type === "Topics"
      );

      if (!tagType) {
        console.log("sendTopicNotifications: skipping -- no tag type");
        continue;
      }

      if (tagType.emailNotif) {
        if (email) {
          console.log(`email: notifying ${email}`);

          if (topic.topicNotifications.find(({ email: e }) => e === email)) {
            console.log("email: skipping -- already notified");
          } else {
            const mail = createTopicEmailNotif({
              email,
              event,
              subscriptionId: subscription._id,
              topic
            });

            await sendMail(mail);
            topicNotification = { ...topicNotification, email };
          }
        }
      }

      if (
        tagType.pushNotif &&
        typeof subscription.user === "object" &&
        subscription.user.userSubscription
      ) {
        console.log(`push: user ${subscription.user._id}`);

        if (
          topic.topicNotifications.find(({ user }) =>
            typeof subscription.user === "object"
              ? equals(user, subscription.user._id)
              : equals(user, subscription.user)
          )
        ) {
          console.log("push: skipping -- user already notified");
          continue;
        }

        try {
          await api.sendPushNotification({
            message: `Appuyez pour lire la discussion`,
            subscription: subscription.user.userSubscription,
            title: "Vous êtes invité à une discussion",
            url: getTopicUrl({ event, topic })
          });
          topicNotification = {
            ...topicNotification,
            user: subscription.user._id
          };
        } catch (error) {
          console.error(error);
          if (process.env.NODE_ENV !== "production")
            topicNotification = {
              ...topicNotification,
              user: subscription.user._id
            };
        }
      }
    }

    topicNotifications.push(topicNotification);
  }

  topic.topicNotifications =
    topic.topicNotifications.concat(topicNotifications);
  await topic.save();

  return topicNotifications;
};

// send new topic message email and/or push notifications to topic followers
export const sendTopicMessageNotifications = async ({
  event,
  org,
  subscriptions,
  topic
}: {
  event?: IEvent;
  org?: IOrg | null;
  subscriptions: ISubscription[];
  topic: ITopic;
}) => {
  if (!event && !org) return;

  const entityName = event ? event.eventName : org?.orgName;
  const entityUrl = event ? event.eventUrl : org?.orgUrl;
  const subject = `Nouvelle réponse à la discussion : ${topic.topicName}`;
  const url = getTopicUrl({ event, org, topic });

  for (const subscription of subscriptions) {
    const email =
      typeof subscription.user === "object"
        ? subscription.user.email
        : subscription.email;

    if (!email) continue;

    const html = `<h1>${subject}</h1><p><a href="${url}">Lire la réponse</a></p>
    <p><a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}&topicId=${topic._id}">Se désabonner de la discussion</a></p>
    <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${entityName}</a>
    `;

    const mail = {
      from: process.env.EMAIL_FROM,
      to: `<${email}>`,
      subject,
      html
    };

    await sendMail(mail);
  }
};

export const sendToAdmin = async ({
  event,
  project
}: {
  event?: Omit<IEvent, "_id">;
  project?: Partial<IProject>;
}) => {
  if (!event && !project) return;

  let mail: Mail = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN
  };

  console.log(event);

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
    await sendMail(mail);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`sent project email notif to ${mail.to}`, mail);
  }
};
