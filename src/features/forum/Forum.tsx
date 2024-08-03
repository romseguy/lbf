import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { useSession } from "hooks/useSession";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { TopicsList } from "./TopicsList";
import { IOrg } from "models/Org";
import { getRefId } from "models/Entity";

export const Forum = ({
  orgQuery,
  subQuery,
  tabItem
}: {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  tabItem?: string;
}) => {
  const { data: session } = useSession();

  //#region org
  const org = orgQuery.data;
  const isCreator =
    session?.user.userId === getRefId(org) || session?.user.isAdmin || false;
  //#endregion

  //#region subscription
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  //#endregion

  if (orgQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap" mt={-3} mb={3}>
        {isFollowed && (
          <Box mr={3} mt={3}>
            <SubscribePopover
              org={org}
              //query={orgQuery}
              subQuery={subQuery}
            />
          </Box>
        )}

        <Box mt={3}>
          <SubscribePopover
            org={org}
            //query={orgQuery}
            subQuery={subQuery}
            notifType="push"
          />
        </Box>
      </Flex>

      <TopicsList
        query={orgQuery}
        subQuery={subQuery}
        isCreator={isCreator}
        isFollowed={isFollowed}
        currentTopicName={tabItem}
      />
    </>
  );
};
