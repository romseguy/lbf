import { CalendarIcon, ChatIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
  Icon,
  Tooltip,
  TooltipProps
} from "@chakra-ui/react";
import React from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { IEvent } from "models/Event";
import {
  IOrg,
  EOrgType,
  EOrgVisibility,
  orgTypeFull5,
  OrgTypes
} from "models/Org";
import { IUser } from "models/User";
import { ITopic } from "models/Topic";
import { useRouter } from "next/router";

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
  if (!org && !event && !user && !topic) return null;
  const router = useRouter();
  let entityUrl = org
    ? org.orgUrl
    : event
    ? event.eventUrl
    : typeof user === "object"
    ? user.userName
    : "";
  if (topic) {
    entityUrl = `${entityUrl || org || event || user}/discussions/${
      topic.topicName
    }`;
  }
  const hasLink = entityUrl !== "" && onClick !== null;

  return (
    <Tooltip
      label={
        hasLink
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
          : ""
      }
      hasArrow
      {...tooltipProps}
    >
      <span>
        <Button
          //aria-hidden
          cursor={hasLink ? "pointer" : "default"}
          height="auto"
          m={0}
          p={1}
          pr={2}
          textAlign="left"
          whiteSpace="normal"
          onClick={(e) => {
            if (onClick) onClick(e);
            else router.push(entityUrl!, entityUrl, { shallow: true });
          }}
          {...props}
        >
          <Icon
            as={
              topic
                ? ChatIcon
                : org
                ? org.orgUrl === "forum"
                  ? ChatIcon
                  : org.orgType === EOrgType.NETWORK
                  ? FaGlobeEurope
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
            mr={1}
          />

          {children ||
            (topic
              ? topic.topicName
              : org
              ? org.orgUrl === "forum"
                ? "Forum"
                : `${
                    org.orgType === EOrgType.TREETOOLS
                      ? OrgTypes[org.orgType] + " : "
                      : ""
                  }${org.orgName}`
              : event
              ? event.eventName
              : user
              ? user.userName
              : "")}

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
