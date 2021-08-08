import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { Layout } from "features/layout";
import { Button } from "features/common";
import { TopicModal } from "features/modals/TopicModal";
import { useGetOrgByNameQuery } from "features/orgs/orgsApi";
import { TopicsList } from "./TopicsList";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  isFollowedBy,
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { useSelector } from "react-redux";

export const Forum = () => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();

  const query = useGetOrgByNameQuery("aucourant");
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

  const subQuery = useGetSubscriptionQuery(session?.user.userId);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch]);

  const [isFollowed, setIsFollowed] = useState(isFollowedBy(org, subQuery));
  const [isSubscribed, setIsSubscribed] = useState(
    isSubscribedBy(org, subQuery)
  );
  useEffect(() => {
    if (org && subQuery.data) {
      setIsFollowed(isFollowedBy(org, subQuery));
      setIsSubscribed(isSubscribedBy(org, subQuery));
    }
  }, [org, subQuery.data]);

  const [isLogin, setIsLogin] = useState(0);

  return (
    <Layout pageTitle="Forum" isLogin={isLogin} p={isMobile ? 5 : 5}>
      <TopicsList
        org={org}
        query={query}
        isCreator={isCreator}
        isFollowed={isFollowed}
        isSubscribed={isSubscribed}
        setIsLogin={setIsLogin}
        isLogin={isLogin}
      />
    </Layout>
  );
};
