import { useColorMode } from "@chakra-ui/react";

import React from "react";
import { Column } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { IEntity } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { ITopic } from "models/Topic";

export const EntityPageTopics = ({
  ...props
}: {
  topics: ITopic[];
  currentTopicName?: string;
  isCreator: boolean;
  isFollowed: boolean;
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Column bg={isDark ? "gray.700" : "lightblue"}>
      <TopicsList {...props} />
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
