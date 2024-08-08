import { EntityPageTopics } from "features/common";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQueryWithData, AppQuery } from "utils/types";

export const OrgPageTopicsTabPanel = ({
  currentTopicName,
  isCreator,
  isFollowed,
  query,
  subQuery
}: {
  currentTopicName?: string;
  isCreator: boolean;
  isFollowed: boolean;
  query: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const entity = query.data;
  const topics = entity.orgTopics.concat(
    entity.orgEvents.map((event) => ({
      _id: event._id,
      event,
      isPinned: true,
      topicName: event._id,
      topicMessages: [],
      topicNotifications: [],
      topicVisibility: [],
      createdAt: event.eventMinDate,
      createdBy: event.createdBy
    }))
  );

  return (
    <EntityPageTopics
      topics={topics}
      currentTopicName={currentTopicName}
      isCreator={isCreator}
      isFollowed={isFollowed}
      query={query}
      subQuery={subQuery}
    />
  );
};
