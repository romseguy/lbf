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
  const isCreator = session?.user.userId === org?.createdBy._id;

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
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  return (
    <Layout pageTitle="Forum" isLogin={isLogin} p={isMobile ? 5 : 5}>
      <Button
        leftIcon={<AddIcon />}
        onClick={() => {
          if (!isSessionLoading) {
            if (session) {
              setIsTopicModalOpen(true);
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
        mb={5}
        dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
      >
        Ajouter un sujet de discussion
      </Button>

      {isTopicModalOpen && org && (
        <TopicModal
          org={org}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            query.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}

      <TopicsList
        org={org}
        query={query}
        isCreator={isCreator}
        isFollowed={isFollowed}
        isSubscribed={isSubscribed}
        onLoginClick={() => setIsLogin(isLogin + 1)}
      />
    </Layout>
  );
};

// <GridItem>
//   <>
//     <Button
//       m={1}
//       leftIcon={<FaReply />}
//       onClick={() =>
//         setIsTopicMessageModalOpen(
//           !isTopicMessageModalOpen
//         )
//       }
//       dark={{
//         bg: "gray.500",
//         _hover: { bg: "gray.400" }
//       }}
//     >
//       Répondre
//     </Button>
//     {isTopicMessageModalOpen && org && (
//       <TopicMessageModal
//         org={org}
//         onCancel={() =>
//           setIsTopicMessageModalOpen(false)
//         }
//         onSubmit={async () => {
//           query.refetch();
//           setIsTopicMessageModalOpen(false);
//         }}
//         onClose={() =>
//           setIsTopicMessageModalOpen(false)
//         }
//       />
//     )}
//   </>
// </GridItem>
