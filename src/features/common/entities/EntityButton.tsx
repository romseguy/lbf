import { CalendarIcon, ChatIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip,
  TooltipProps,
  useColorMode
} from "@chakra-ui/react";

import React from "react";
import { GrWorkshop } from "react-icons/gr";
import { FaTree } from "react-icons/fa";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { css } from "twin.macro";
import { IEvent } from "models/Event";
import {
  IOrg,
  EOrgType,
  EOrgVisibility,
  OrgTypes,
  orgTypeFull5
} from "models/Org";
import { IUser } from "models/User";
import { ITopic } from "models/Topic";
import { useRouter } from "next/router";
import { getRefId } from "models/Entity";

export const EntityButton = ({
  children,
  event,
  org,
  topic,
  user,
  onClick,
  tooltipProps,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  event?: Partial<IEvent<any>>;
  org?: Partial<IOrg>;
  topic?: ITopic;
  user?: Partial<IUser>;
  onClick?:
    | null
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  tooltipProps?: Partial<TooltipProps>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  const entityName = topic
    ? topic.topicName
    : org
    ? `${
        org.orgType === EOrgType.TREETOOLS ? OrgTypes[org.orgType] + " : " : ""
      }${org.orgName}`
    : event
    ? event.eventName
    : user
    ? user.userName
    : "";
  let entityUrl = org
    ? org.orgUrl
    : event
    ? event.eventUrl
    : typeof user === "object"
    ? user.userName
    : "";
  if (topic) {
    entityUrl = `${
      entityUrl || getRefId(topic.org) || getRefId(topic.event)
    }/discussions/${topic.topicName}`;
  }
  const hasLink = !!entityUrl || !!onClick;
  const label = hasLink
    ? topic
      ? "Aller à la discussion"
      : org
      ? org.orgUrl === "forum"
        ? "Aller au forum"
        : org.orgType
        ? `Visiter ${orgTypeFull5(org.orgType)}`
        : ""
      : event
      ? "Aller à la page de l'événement"
      : user
      ? "Visiter la page de l'utilisateur"
      : ""
    : "";

  if (!entityUrl && !onClick) return null;

  return (
    <Tooltip label={label} hasArrow {...tooltipProps}>
      <span>
        <Button
          aria-label={label}
          colorScheme="teal"
          leftIcon={
            <Icon
              as={
                topic
                  ? ChatIcon
                  : org
                  ? org.orgUrl === "forum"
                    ? ChatIcon
                    : org.orgType === EOrgType.NETWORK
                    ? GrWorkshop
                    : FaTree
                  : event
                  ? CalendarIcon
                  : user
                  ? IoIosPerson
                  : ChatIcon
              }
              color={
                topic
                  ? "blue.500"
                  : org
                  ? org.orgType === EOrgType.NETWORK
                    ? "blue.500"
                    : "green.500"
                  : event
                  ? "green.500"
                  : "blue.500"
              }
              css={css`
                path {
                  fill: ${isDark ? "white" : "white"};
                }
              `}
            />
          }
          height="auto"
          cursor={hasLink ? "pointer" : "default"}
          textAlign="left"
          whiteSpace="normal"
          m={0}
          p={1}
          pr={2}
          onClick={(e) => {
            if (onClick) onClick(e);
            else if (onClick !== null)
              router.push(entityUrl!, entityUrl, { shallow: true });
          }}
          {...props}
        >
          {children || entityName}

          {Array.isArray(topic?.topicVisibility) &&
          topic?.topicVisibility.includes("Abonnés") ? (
            <Icon as={IoIosPeople} ml={2} />
          ) : org && org.orgVisibility === EOrgVisibility.PRIVATE ? (
            <Icon as={LockIcon} ml={2} />
          ) : null}
        </Button>
      </span>
    </Tooltip>
  );
};
