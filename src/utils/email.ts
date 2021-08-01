import type { IEvent } from "models/Event";

export const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const sendToEmailList = async (event: IEvent, transport: any) => {
  if (
    !Array.isArray(event.eventOrgs) ||
    !event.eventOrgs.length ||
    !Array.isArray(event.eventNotif) ||
    !event.eventNotif.length
  )
    return;

  for (const org of event.eventOrgs) {
    for (const orgId of event.eventNotif) {
      if (orgId !== org._id) continue;
      for (const orgSubscription of org.orgSubscriptions) {
        process.env.NODE_ENV === "production" &&
          (await transport.sendMail({
            from: process.env.EMAIL_FROM,
            to: `<${orgSubscription.email}>`,
            subject: `${org.orgName} vous invite à un nouvel événement : ${event.eventName}`,
            html: `
              <h1>${org.orgName} vous invite à un nouvel événement : ${event.eventName}</h1>
              <p>Rendez-vous sur <a href="${process.env.NEXTAUTH_URL}/${event.eventName}">aucourant.de/${event.eventName}</a> pour en savoir plus.</p>
              `
          }));
      }
    }
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
        <p>Rendez-vous sur <a href="${process.env.NEXTAUTH_URL}/${event.eventName}">aucourant.de/${event.eventName}</a> pour en savoir plus.</p>
      `
    }));
};
