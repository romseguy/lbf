import { Flex, Box } from "@chakra-ui/react";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { useSession } from "hooks/useSession";
import { IOrg } from "models/Org";
import { ISubscription, getFollowerSubscription } from "models/Subscription";
import { AppQueryWithData, AppQuery } from "utils/types";

export const EntityPageSubscribeButton = ({
  orgQuery,
  subQuery
}: {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { data: session } = useSession();
  const org = orgQuery.data;
  const isFollowed = !!getFollowerSubscription({ org, subQuery });

  const isDisabled =
    orgQuery.isFetching ||
    subQuery.isFetching ||
    (org.orgUrl === "nom_de_votre_forum" && !session);

  return (
    <Flex flexWrap="wrap" mt={-3}>
      {isFollowed && (
        <Box mr={3} mt={3}>
          <SubscribePopover
            isDisabled={isDisabled}
            org={org}
            //query={orgQuery}
            subQuery={subQuery}
          />
        </Box>
      )}

      {/* <Box mt={3}>
        <SubscribePopover
          isDisabled={isDisabled}
          org={org}
          //query={orgQuery}
          subQuery={subQuery}
          notifType="push"
        />
      </Box> */}
    </Flex>
  );
};
