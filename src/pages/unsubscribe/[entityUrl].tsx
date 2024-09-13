import { Alert, AlertIcon } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { Layout } from "features/layout";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription, EOrgSubscriptionType } from "models/Subscription";
import { ITopic } from "models/Topic";
import { PageProps } from "main";
import api, { ResponseType } from "utils/api";
import { getRefId } from "models/Entity";

interface UnsubscribePageProps {
  unsubscribed: boolean;
  org?: IOrg;
  event?: IEvent;
  topic?: ITopic;
}

const UnsubscribePage = (props: PageProps & UnsubscribePageProps) => {
  const { unsubscribed, event, org, topic, ...rest } = props;

  return (
    <Layout {...rest} pageTitle="Désabonnement">
      <Alert status={unsubscribed ? "success" : "error"}>
        <AlertIcon />

        {unsubscribed
          ? org || event
            ? `Vous avez été désabonné ${
                org
                  ? org.orgUrl !== "forum"
                    ? orgTypeFull(org.orgType)
                    : "du"
                  : "l'événement"
              } ${org ? org.orgName : event?.eventName}.`
            : topic
              ? `Vous avez été désabonné de la discussion : ${topic.topicName}`
              : "Vous n'avez pas pu être désabonné."
          : "Vous n'avez pas pu être désabonné."}
      </Alert>
    </Layout>
  );
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<UnsubscribePageProps>> {
  const entityUrl = (ctx.params as ParsedUrlQuery).entityUrl as string;
  const {
    subscriptionId,
    topicId
  }: { subscriptionId?: string; topicId?: string } = ctx.query;

  console.log("/unsubscribe entityUrl: ", entityUrl);
  console.log("/unsubscribe subscriptionId: ", subscriptionId);
  console.log("/unsubscribe topicId: ", topicId);

  try {
    if (subscriptionId) {
      const { data: subscription }: ResponseType<ISubscription> = await api.get(
        "subscription/" + subscriptionId + "?populate=user"
      );

      if (subscription) {
        if (topicId) {
          const topicSubscription = subscription.topics?.find(
            ({ topic }) => topic !== null && getRefId(topic) === topicId
          );

          if (topicSubscription) {
            const { data: subscription } = await api.remove(
              `subscription/${subscriptionId}`,
              {
                topicId
              }
            );

            if (subscription)
              return {
                props: {
                  unsubscribed: true,
                  topic: topicSubscription.topic!
                }
              };
          }
        } else {
          const { data: org }: ResponseType<IOrg> = await api.get(
            "org/" + entityUrl
          );

          if (org) {
            const { data: deletedSubscription } = await api.remove(
              `subscription/${subscriptionId}`,
              {
                orgs: [
                  {
                    orgId: org._id,
                    type: EOrgSubscriptionType.FOLLOWER
                  }
                ]
              }
            );

            if (deletedSubscription)
              return { props: { unsubscribed: true, org } };
          } else {
            const { data: event }: ResponseType<IEvent> = await api.get(
              "event/" + entityUrl
            );

            if (event) {
              const { data: deletedSubscription } = await api.remove(
                `subscription/${subscriptionId}`,
                {
                  events: [
                    {
                      eventId: event._id
                    }
                  ]
                }
              );

              if (deletedSubscription)
                return { props: { unsubscribed: true, event } };
            }
          }
        }
      } else {
        console.log("/unsubscribe could not find subscription");
      }
    }

    return { props: { unsubscribed: false } };
  } catch (error) {
    console.error("/unsubscribe error", error);
    return { props: { unsubscribed: false } };
  }
}

export default UnsubscribePage;

{
  /*
    else {
      const { data: subscription } = await api.remove(
        `subscription/${subscriptionId}`,
        {
          orgs: [
            {
              orgId: org._id,
              org,
              type: EOrgSubscriptionType.FOLLOWER
            }
          ]
        }
      );

      if (subscription)
        return { props: { unsubscribed: true, org } };
    }
  */
}
