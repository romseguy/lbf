import { useColorMode } from "@chakra-ui/react";

import React from "react";
import { Column } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { getEmail, ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { ITopic } from "models/Topic";
import { useSession } from "hooks/useSession";

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
  const { data: session } = useSession();

  const entity = props.query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const attendees = (
    isO ? entity.orgLists : isE ? entity.eventOrgs[0].orgLists : []
  ).find(({ listName }) => listName === "Participants");
  const isAttendee =
    session?.user.isAdmin ||
    !!attendees?.subscriptions.find(
      (sub) => getEmail(sub) === session?.user.email
    );

  return <TopicsList {...props} isAttendee={isAttendee} />;
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
