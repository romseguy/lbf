import { Flex, Box } from "@chakra-ui/react";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { useSession } from "hooks/useSession";
import { IOrg } from "models/Org";
import { ISubscription, getFollowerSubscription } from "models/Subscription";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { AppQueryWithData, AppQuery } from "utils/types";

export const EntityPageSubscribeButton = ({
  orgQuery,
  subQuery
}: {
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const isMobile = useSelector(selectIsMobile);
  const { data: session } = useSession();
  const org = orgQuery.data;
  const isFollowed = !!getFollowerSubscription({ org, subQuery });

  const isDisabled =
    orgQuery.isFetching ||
    subQuery.isFetching ||
    (org.orgUrl === "nom_de_votre_forum" && !session);

  return (
    <Flex flexWrap="wrap" mt={-3}>
      <Box mr={3} mt={3}>
        <SubscribePopover
          org={org}
          //query={orgQuery}
          subQuery={subQuery}
          offset={[isMobile ? 45 : 45, 15]}
          triggerProps={{
            isDisabled
          }}
        />
      </Box>

      {isFollowed && (
        <Box mt={3}>
          <SubscribePopover
            org={org}
            //query={orgQuery}
            subQuery={subQuery}
            notifType="push"
            triggerProps={{
              isDisabled
            }}
          />
        </Box>
      )}
    </Flex>
  );
};
