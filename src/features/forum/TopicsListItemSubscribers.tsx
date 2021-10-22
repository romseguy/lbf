import { Spinner, Tag, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSession } from "hooks/useAuth";
import { ITopic } from "models/Topic";
import { Link } from "features/common";
import { useGetSubscriptionsQuery } from "features/subscriptions/subscriptionsApi";

export const TopicsListItemSubscribers = ({
  topic,
  isSubbedToTopic
}: {
  topic: ITopic;
  isSubbedToTopic: boolean;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const query = useGetSubscriptionsQuery({ topicId: topic._id });
  useEffect(() => query.refetch, [isSubbedToTopic]);

  if (query.isLoading || query.isFetching) return <Spinner boxSize={4} />;

  return Array.isArray(query.data) && query.data.length > 0 ? (
    <Text>
      Abonnés à la discussion :{" "}
      {query.data.map((subscription) => {
        if (typeof subscription.user !== "object") return;

        const userName =
          subscription.user.userName || session?.user.email.replace(/@.+/, "");

        return (
          <Link key={subscription._id} href={`/${userName}`}>
            <Tag mr={1} mb={1}>
              {userName}
            </Tag>
          </Link>
        );
      })}
    </Text>
  ) : (
    <Text>Aucun abonnés à la discussion.</Text>
  );
};
