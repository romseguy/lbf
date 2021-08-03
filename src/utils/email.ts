import { models } from "database";
import type { IEvent } from "models/Event";

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const sendToFollowers = async (event: IEvent, transport: any) => {
  if (
    !Array.isArray(event.eventOrgs) ||
    !event.eventOrgs.length ||
    !Array.isArray(event.eventNotif) ||
    !event.eventNotif.length
  )
    return;

  const emailList = [];

  for (const org of event.eventOrgs) {
    for (const orgId of event.eventNotif) {
      if (orgId !== org._id) continue;

      for (const orgSubscription of org.orgSubscriptions) {
        const subscription = await models.Subscription.findOne({
          _id: orgSubscription
        }).populate("user");
        const email = subscription.email || subscription.user?.email;
        const eventUrl = `${process.env.NEXTAUTH_URL}/${event.eventName}`;
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

  return emailList;
};

export const sendToAdmin = async (event: IEvent, transport: any) => {
  process.env.NODE_ENV === "production" &&
    (await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_ADMIN,
      subject: `Un événement attend votre approbation : ${event.eventName}`,
      html: `
        <h1>Nouvel événement : ${event.eventName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXTAUTH_URL}/${event.eventName}">aucourant.de/${event.eventName}</a> pour en savoir plus.</p>
      `
    }));
};
