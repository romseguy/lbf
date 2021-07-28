import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { Layout } from "features/layout";
import { Button } from "features/common";
import { TopicModal } from "features/modals/TopicModal";
import { useGetOrgByNameQuery } from "features/orgs/orgsApi";
import { TopicsList } from "./TopicsList";

export const Forum = () => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const query = useGetOrgByNameQuery("aucourant");
  const org = query.data;

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
        onLoginClick={() => setIsLogin(isLogin + 1)}
        maxWidth="md"
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
