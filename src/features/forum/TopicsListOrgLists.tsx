import {
  Button,
  Flex,
  FlexProps,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
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
          <Tooltip
            key={"orgList-" + index}
            label={`Afficher les discussions réservées aux membres de la liste de diffusion "${orgList.listName}"`}
            hasArrow
          >
            <Button
              variant={isSelected ? "solid" : "outline"}
              colorScheme={isSelected ? "pink" : undefined}
              fontSize="small"
              fontWeight="normal"
              height="auto"
              mr={1}
              p={1}
              //whiteSpace="nowrap"
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
