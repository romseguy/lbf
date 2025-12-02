import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { EntityPageConfigButton, Link } from "features/common";
import { Layout } from "features/layout";
import { getRefId } from "models/Entity";
import { IEvent } from "models/Event";
import { PageProps } from "main";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventConfigPanel, EventConfigVisibility } from "./EventConfigPanel";
import { EventPageTabs } from "./EventPageTabs";
import { useSession } from "hooks/useSession";

//let isFirstLoad = true;

export const EventPage = ({
  eventQuery,
  isMobile,
  tab,
  tabItem,
}: PageProps & {
  eventQuery: AppQueryWithData<IEvent>;
  tab?: string;
  tabItem?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();

  // useEffect(() => {
  //   if ((router.asPath.match(/\//g) || []).length > 1) {
  //     isFirstLoad = false;
  //     return;
  //   }
  //   isFirstLoad = false;
  // }, [router.asPath]);

  //#region event
  const event = eventQuery.data;
  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName || event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === getRefId(event) || session?.user.isAdmin || false;
  //#endregion

  //#region config
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //#endregion

  //#region visibility
  const _isVisible = {
    banner: false,
    logo: false,
    topicCategories: false,
  };
  const [isVisible, _setIsVisible] =
    useState<EventConfigVisibility["isVisible"]>(_isVisible);
  const toggleVisibility = (
    key?: keyof EventConfigVisibility["isVisible"],
    bool?: boolean,
  ) =>
    _setIsVisible(
      !key
        ? _isVisible
        : Object.keys(isVisible).reduce((obj, objKey) => {
            if (objKey === key)
              return {
                ...obj,
                [objKey]: bool !== undefined ? bool : !isVisible[key],
              };

            return { ...obj, [objKey]: false };
          }, {}),
    );
  //#endregion

  //#region local state
  //#endregion

  return (
    <Layout entity={event} isMobile={isMobile}>
      {isCreator && (
        <EntityPageConfigButton
          isConfig={isConfig}
          isEdit={isEdit}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          mb={3}
        />
      )}

      {!isConfig && !isEdit && (
        <>
          <Box mb={3}>
            <Text fontSize="smaller">
              Événement ajouté le{" "}
              {format(parseISO(event.createdAt!), "eeee d MMMM yyyy", {
                locale: fr,
              })}{" "}
              par :{" "}
              <Link variant="underline" href={`/${eventCreatedByUserName}`}>
                {eventCreatedByUserName}
              </Link>{" "}
              {isCreator && "(Vous)"}
            </Text>
          </Box>

          <EventPageTabs
            currentItemName={tabItem}
            currentTabLabel={tab}
            eventQuery={eventQuery}
            isCreator={isCreator}
            setIsConfig={setIsConfig}
            setIsEdit={setIsEdit}
          />
        </>
      )}

      {session && isCreator && (isConfig || isEdit) && (
        <EventConfigPanel
          session={session}
          eventQuery={eventQuery}
          isEdit={isEdit}
          isVisible={isVisible}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          toggleVisibility={toggleVisibility}
        />
      )}
    </Layout>
  );
};
