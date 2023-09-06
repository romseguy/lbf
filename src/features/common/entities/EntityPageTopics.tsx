import { ChatIcon } from "@chakra-ui/icons";
import { Flex, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Column, AppHeading } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { useScroll } from "hooks/useScroll";
import { IEntity } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";

export const EntityPageTopics = ({
  currentTopicName,
  isCreator,
  isFollowed,
  query,
  subQuery
}: {
  currentTopicName?: string;
  isCreator: boolean;
  isFollowed: boolean;
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();

  // useEffect(() => {
  //   if (Array.isArray(router.query.name) && !!router.query.name[2]) return;

  //   executeScroll();
  //   console.log(
  //     "🚀 ~ file: OrgPageTabs.tsx:TopicsTabPanel:62 ~ useEffect ~ executeScroll:"
  //   );
  // }, []);

  return (
    <>
      <Flex ref={elementToScrollRef} alignItems="center">
        <ChatIcon boxSize={6} mr={3} mt={3} />
        <AppHeading noContainer mb={3}>
          Discussions
        </AppHeading>
      </Flex>

      <Column bg={isDark ? "gray.700" : "lightblue"}>
        <TopicsList
          currentTopicName={currentTopicName}
          isCreator={isCreator}
          isFollowed={isFollowed}
          query={query}
          subQuery={subQuery}
        />
      </Column>
    </>
  );
};
