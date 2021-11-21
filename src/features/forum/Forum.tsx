import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { useEditOrgMutation, useGetOrgQuery } from "features/orgs/orgsApi";
import { TopicsList } from "./TopicsList";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  getFollowerSubscription,
  getSubscriberSubscription
} from "models/Subscription";
import { useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";
import { selectUserEmail } from "features/users/userSlice";

export const Forum = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
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
  const [isFollowed, setIsFollowed] = useState(
    !!getFollowerSubscription({ org, subQuery })
  );
  const [isSubscribed, setIsSubscribed] = useState(
    getSubscriberSubscription({ org, subQuery })
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
    />
  );
};
