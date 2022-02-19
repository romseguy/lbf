import { Alert, AlertIcon } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { Layout } from "features/layout";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription, ESubscriptionType } from "models/Subscription";
import { ITopic } from "models/Topic";
import { PageProps } from "pages/_app";
import api, { ResponseType } from "utils/api";

type UnsubscribePageProps = {
  unsubscribed: boolean;
  org?: IOrg;
  event?: IEvent;
  topic?: ITopic;
  subscription?: ISubscription;
  session?: Session | null;
};

const UnsubscribePage = (props: PageProps & UnsubscribePageProps) => {
  const { unsubscribed, event, org, topic, subscription, ...rest } = props;

  const who = subscription
    ? typeof subscription.user === "object"
      ? subscription.user.email + " a été"
      : subscription.email + " a été"
    : "Vous avez été";

  return (
    <Layout {...rest}>
      <Alert status={unsubscribed ? "success" : "error"}>
        <AlertIcon />

        {unsubscribed
          ? org || event
            ? `${who} désabonné ${
                org
                  ? org.orgUrl !== "forum"
                    ? orgTypeFull(org.orgType)
                    : "du"
                  : "l'événement"
              } ${org ? org.orgName : event?.eventName}.`
            : topic
            ? `${who} désabonné de la discussion : ${topic.topicName}`
            : "Vous n'avez pas pu être désabonné."
          : "Vous n'avez pas pu être désabonné."}
      </Alert>
    </Layout>
  );
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{ props: UnsubscribePageProps }> {
  const { entityUrl } = ctx.params || {};
  const {
    subscriptionId,
    topicId
  }: { subscriptionId?: string; topicId?: string } = ctx.query;

  if (!subscriptionId || !entityUrl) return { props: { unsubscribed: false } };

  const { data: subscription }: ResponseType<ISubscription> = await api.get(
    "subscription/" + subscriptionId + "?populate=user"
  );

  if (!subscription) return { props: { unsubscribed: false } };

  const { data: org }: ResponseType<IOrg> = await api.get("org/" + entityUrl);

  if (org) {
    if (topicId) {
      const topicSubscription = subscription.topics?.find(
        ({ topic }) => topic._id === topicId
      );

      if (topicSubscription) {
        const { data: subscription } = await api.remove(
          `subscription/${subscriptionId}`,
          {
            orgId: org._id,
            topicId
          }
        );

        if (subscription)
          return {
            props: {
              unsubscribed: true,
              topic: topicSubscription.topic,
              subscription
            }
          };
      } else {
        const { data: subscription } = await api.remove(
          `subscription/${subscriptionId}`,
          {
            orgs: [
              {
                orgId: org._id,
                org,
                type: ESubscriptionType.FOLLOWER
              }
            ]
          }
        );

        if (subscription)
          return { props: { unsubscribed: true, org, subscription } };
      }
    } else {
      const { data: subscription } = await api.remove(
        `subscription/${subscriptionId}`,
        {
          orgs: [
            {
              orgId: org._id,
              type: ESubscriptionType.FOLLOWER
            }
          ]
        }
      );

      if (subscription)
        return { props: { unsubscribed: true, org, subscription } };
    }
  }

  const { data: event }: ResponseType<IEvent> = await api.get(
    "event/" + entityUrl
  );

  if (event) {
    const { data: subscription } = await api.remove(
      `subscription/${subscriptionId}`,
      {
        events: [
          {
            eventId: event._id
          }
        ]
      }
    );

    if (subscription)
      return { props: { unsubscribed: true, event, subscription } };
  }

  return { props: { unsubscribed: false } };
}

export default UnsubscribePage;
