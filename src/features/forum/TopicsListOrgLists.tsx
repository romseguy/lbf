import {
  Button,
  Flex,
  FlexProps,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import React from "react";
import { getSubscriptions, IOrg, IOrgList } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { AppQuery } from "utils/types";

export const TopicsListOrgLists = ({
  org,
  isCreator,
  selectedLists,
  setSelectedLists,
  subQuery,
  ...props
}: FlexProps & {
  org: IOrg;
  isCreator?: boolean;
  selectedLists?: IOrgList[];
  setSelectedLists: React.Dispatch<
    React.SetStateAction<IOrgList[] | undefined>
  >;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  let lists: IOrgList[] = [];

  const followerSubscription = getFollowerSubscription({ org, subQuery });
  const subscriberSubscription = getSubscriberSubscription({ org, subQuery });

  if (isCreator || followerSubscription)
    lists.push({
      listName: "Abonnés",
      subscriptions: getSubscriptions(org, SubscriptionTypes.FOLLOWER)
    });

  if (isCreator || subscriberSubscription)
    lists.push({
      listName: "Adhérents",
      subscriptions: getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
    });

  if (org.orgLists) {
    lists = [
      ...lists,
      ...(org.orgLists.filter((orgList) => {
        if (isCreator) return true;
        if (subQuery.data)
          return !!orgList?.subscriptions?.find(
            (subscription) => subscription._id === subQuery.data?._id
          );
        return false;
      }) || [])
    ];
  }

  return (
    <Flex flexWrap="wrap" {...props}>
      {lists.map((orgList, index) => {
        const isSelected = selectedLists?.find(
          ({ listName }) => listName === orgList.listName
        );

        return (
          <Tooltip
            key={"orgList-" + index}
            label={`Afficher les discussions réservées aux membres de la liste de diffusion "${orgList.listName}"`}
            hasArrow
          >
            <Button
              bg={
                isSelected
                  ? isDark
                    ? "pink.200"
                    : "pink.500"
                  : isDark
                  ? "#81E6D9"
                  : "#319795"
              }
              _hover={{
                bg: isSelected
                  ? isDark
                    ? "pink.300"
                    : "pink.600"
                  : isDark
                  ? "#4FD1C5"
                  : "#2C7A7B"
              }}
              color={isDark ? "black" : "white"}
              fontSize="small"
              fontWeight="normal"
              height="auto"
              // mb={1} // when wrapped
              mr={1}
              p={2}
              onClick={() => {
                selectedLists?.find(
                  ({ listName }) => listName === orgList.listName
                )
                  ? setSelectedLists(
                      selectedLists.filter(
                        ({ listName }) => listName !== orgList.listName
                      )
                    )
                  : setSelectedLists((selectedLists || []).concat([orgList]));
              }}
            >
              {orgList.listName}
            </Button>
          </Tooltip>
        );
      })}
    </Flex>
  );
};
