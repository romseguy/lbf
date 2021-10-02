import { Alert, AlertIcon } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { Layout } from "features/layout";
import { getOrg } from "features/orgs/orgsApi";
import {
  deleteSubscription,
  getSubscription
} from "features/subscriptions/subscriptionsApi";
import { SubscriptionTypes } from "models/Subscription";
import { wrapper } from "store";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";

type UnsubscribePageProps = {
  unsubscribed: boolean;
  org?: IOrg;
  topic?: ITopic;
};

const UnsubscribePage = ({
  unsubscribed,
  org,
  topic
}: UnsubscribePageProps) => {
  return (
    <Layout>
      <Alert status={unsubscribed ? "success" : "error"}>
        <AlertIcon />
        {unsubscribed
          ? org
            ? `Vous avez été désabonné de ${org?.orgName}.`
            : topic
            ? `Vous avez été désabonné de la discussion : ${topic.topicName}`
            : "Nous n'avons pas pu vous désabonner."
          : "Nous n'avons pas pu vous désabonner."}
      </Alert>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async (
      ctx: GetServerSidePropsContext<{
        entityUrl?: string;
      }>
    ): Promise<{ props: UnsubscribePageProps }> => {
      const { entityUrl } = ctx.params || {};
      const {
        subscriptionId,
        topicId
      }: { subscriptionId?: string; topicId?: string } = ctx.query;

      if (subscriptionId && entityUrl) {
        const query = await store.dispatch(
          getOrg.initiate({ orgUrl: entityUrl })
        );
        const org = query.data;

        if (org) {
          if (topicId) {
            const subQuery = await store.dispatch(
              getSubscription.initiate(subscriptionId)
            );
            const subscription = subQuery.data;

            if (subscription) {
              const topicSubscription = subscription.topics.find(
                ({ topic }) => topic._id === topicId
              );

              if (topicSubscription) {
                const q = await store.dispatch(
                  deleteSubscription.initiate({
                    subscriptionId,
                    topicId
                  })
                );

                if ("data" in q)
                  return {
                    props: {
                      unsubscribed: true,
                      topic: topicSubscription.topic
                    }
                  };
              }
            }
          } else {
            const subQuery = await store.dispatch(
              deleteSubscription.initiate({
                subscriptionId,
                payload: {
                  orgs: [
                    {
                      orgId: org._id,
                      org,
                      type: SubscriptionTypes.FOLLOWER
                    }
                  ]
                }
              })
            );

            if ("data" in subQuery)
              return { props: { unsubscribed: true, org } };
          }
        } else {
          // todo: event
        }
      }

      return { props: { unsubscribed: false } };
    }
);

export default UnsubscribePage;
