import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { useGetOrgQuery } from "features/orgs/orgsApi";
import { TopicsList } from "./TopicsList";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  isFollowedBy,
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";
import { selectSubscribedEmail } from "features/users/userSlice";

export const Forum = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();

  //#region org
  const query = useGetOrgQuery("aucourant");
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
  const subscribedEmail = useSelector(selectSubscribedEmail);
  const subQuery = useGetSubscriptionQuery(
    subscribedEmail || session?.user.userId
  );
  const [isFollowed, setIsFollowed] = useState(
    !!isFollowedBy({ org, subQuery })
  );
  const [isSubscribed, setIsSubscribed] = useState(
    isSubscribedBy(org, subQuery)
  );
  useEffect(() => {
    if (org && subQuery.data) {
      setIsFollowed(!!isFollowedBy({ org, subQuery }));
      setIsSubscribed(isSubscribedBy(org, subQuery));
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
      isCreator={isCreator}
      isFollowed={isFollowed}
      isSubscribed={isSubscribed}
      setIsLogin={setIsLogin}
      isLogin={isLogin}
    />
  );
};
