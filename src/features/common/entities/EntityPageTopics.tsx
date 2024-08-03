import { Flex, HStack, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { Column } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { IEntity, isEvent } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IoMdBuild } from "react-icons/io";

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
  // const isE = isEvent(query.data);

  // if (!isE) return null;

  return (
    <Column bg={isDark ? "gray.700" : "lightblue"}>
      <TopicsList
        currentTopicName={currentTopicName}
        isCreator={isCreator}
        isFollowed={isFollowed}
        query={query}
        subQuery={subQuery}
      />
    </Column>
  );
};

{
  /*
  const router = useRouter();
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();

  useEffect(() => {
    if (Array.isArray(router.query.name) && !!router.query.name[2]) return;

    executeScroll();
    console.log(
      "🚀 ~ file: OrgPageTabs.tsx:TopicsTabPanel:62 ~ useEffect ~ executeScroll:"
    );
  }, []);

      <Flex ref={elementToScrollRef} alignItems="center" mb={3}>
        <ChatIcon boxSize={6} mr={3} />
        <AppHeading>Discussions</AppHeading>
      </Flex>
  */
}
