import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useEditOrgMutation, useGetOrgQuery } from "features/orgs/orgsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { selectUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import {
  getFollowerSubscription,
  getSubscriberSubscription
} from "models/Subscription";
import { TopicsList } from "./TopicsList";

export const Forum = ({
  isLogin,
  setIsLogin,
  tabItem
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  tabItem?: string;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region org
  const mutation = useEditOrgMutation();
  const query = useGetOrgQuery({
    orgUrl: "aucourant",
    populate: "orgTopics orgSubscriptions"
  });
  const org = query.data;

  let isCreator = false;
  if (session && org) {
    if (
      typeof org.createdBy === "object" &&
      org.createdBy._id === session.user.userId
    ) {
      isCreator = true;
    } else if (org.createdBy === session.user.userId) {
      isCreator = true;
    }
  }
  //#endregion

  //#region subscription
  const subQuery = useGetSubscriptionQuery({ email: userEmail });
  const followerSubscription = getFollowerSubscription({ org, subQuery });
  const [isFollowed, setIsFollowed] = useState(!!followerSubscription);
  const [isSubscribed, setIsSubscribed] = useState(
    !!getSubscriberSubscription({ org, subQuery })
  );
  useEffect(() => {
    if (org && subQuery.data) {
      setIsFollowed(!!getFollowerSubscription({ org, subQuery }));
      setIsSubscribed(!!getSubscriberSubscription({ org, subQuery }));
    }
  }, [org, subQuery.data]);
  //#endregion

  if (query.isLoading) {
    return <Spinner />;
  }

  if (!org) return null;

  return (
    <>
      {!subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3} mb={3}>
          {followerSubscription && (
            <Box mr={3} mt={3}>
              <SubscriptionPopover
                org={org}
                query={query}
                subQuery={subQuery}
                followerSubscription={followerSubscription}
                //isLoading={subQuery.isLoading || subQuery.isFetching}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscriptionPopover
              org={org}
              query={query}
              subQuery={subQuery}
              followerSubscription={followerSubscription}
              notifType="push"
              //isLoading={subQuery.isLoading || subQuery.isFetching}
            />
          </Box>
        </Flex>
      )}
      <TopicsList
        org={org}
        query={query}
        mutation={mutation}
        subQuery={subQuery}
        isCreator={isCreator}
        isFollowed={isFollowed}
        isSubscribed={isSubscribed}
        setIsLogin={setIsLogin}
        isLogin={isLogin}
        currentTopicName={tabItem}
      />
    </>
  );
};
