import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEditOrgMutation, useGetOrgQuery } from "features/orgs/orgsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useSession } from "hooks/useAuth";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { AppQuery } from "utils/types";
import { TopicsList } from "./TopicsList";
import { IOrg } from "models/Org";

export const Forum = ({
  isLogin,
  setIsLogin,
  orgQuery,
  subQuery,
  tabItem
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  orgQuery: AppQuery<IOrg>;
  subQuery: AppQuery<ISubscription>;
  tabItem?: string;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();

  //#region org
  const mutation = useEditOrgMutation();
  const org = orgQuery.data;

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
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  const isSubscribed = !!getSubscriberSubscription({ org, subQuery });
  //#endregion

  if (orgQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap" mt={-3} mb={3}>
        {isFollowed && (
          <Box mr={3} mt={3}>
            <SubscriptionPopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
            />
          </Box>
        )}

        <Box mt={3}>
          <SubscriptionPopover
            org={org}
            query={orgQuery}
            subQuery={subQuery}
            notifType="push"
          />
        </Box>
      </Flex>

      <TopicsList
        org={org}
        query={orgQuery}
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
