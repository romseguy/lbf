import { Tag, useColorMode } from "@chakra-ui/react";
import { Flex, FlexProps } from "@chakra-ui/layout";
import { Link } from "features/common";
import React from "react";
import { getSubscriptions, IOrg, IOrgList } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";

export const TopicsListOrgLists = ({
  org,
  selectedLists,
  setSelectedLists,
  ...props
}: FlexProps & {
  org: IOrg;
  selectedLists?: IOrgList[];
  setSelectedLists: React.Dispatch<
    React.SetStateAction<IOrgList[] | undefined>
  >;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const lists = [
    {
      listName: "Abonnés",
      subscriptions: getSubscriptions(org, SubscriptionTypes.FOLLOWER)
    },
    {
      listName: "Adhérents",
      subscriptions: getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
    }
  ].concat(org.orgLists || []);

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {lists.map((orgList, index) => {
        const isSelected = selectedLists?.find(
          ({ listName }) => listName === orgList.listName
        );

        return (
          <Link
            key={"orgList-" + index}
            variant="no-underline"
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
            <Tag
              variant={isSelected ? "solid" : "outline"}
              color="white"
              bgColor={
                isSelected
                  ? "pink.600"
                  : isDark
                  ? "whiteAlpha.300"
                  : "blackAlpha.600"
              }
              mr={1}
              whiteSpace="nowrap"
            >
              {orgList.listName}
            </Tag>
          </Link>
        );
      })}
    </Flex>
  );
};
