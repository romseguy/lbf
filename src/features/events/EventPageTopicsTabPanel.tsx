import { EntityPageTopics } from "features/common";
import { IEvent } from "models/Event";
import { ISubscription } from "models/Subscription";
import { AppQueryWithData, AppQuery } from "utils/types";

export const EventPageTopicsTabPanel = ({
  currentTopicName,
  isCreator,
  isFollowed,
  query,
  subQuery
}: {
  currentTopicName?: string;
  isCreator: boolean;
  isFollowed: boolean;
  query: AppQueryWithData<IEvent>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const entity = query.data;
  const topics = entity.eventTopics;

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
