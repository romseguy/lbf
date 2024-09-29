import { TopicsList } from "features/forum/TopicsList";
import { useSession } from "hooks/useSession";
import { IEntity, isAttendee } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import React from "react";
import { AppQuery, AppQueryWithData } from "utils/types";

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
  return (
    <TopicsList {...props} isAttendee={isAttendee(props.query.data, session)} />
  );
};
