import { CalendarIcon, ChatIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  StyleProps,
  ThemingProps,
  Tooltip,
  TooltipProps
} from "@chakra-ui/react";
import React from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { Link } from "features/common";
import {
  IOrg,
  EOrgType,
  EOrgVisibility,
  orgTypeFull5,
  OrgTypes
} from "models/Org";
import { IEvent } from "models/Event";
import { IUser } from "models/User";
import { ITopic } from "models/Topic";
import { useRouter } from "next/router";
import { FaGlobeEurope, FaTree } from "react-icons/fa";

export const EntityButton = ({
  event,
  org,
  topic,
  user,
  onClick,
  tooltipProps,
  ...props
}: ThemingProps<"Button"> &
  StyleProps & {
    event?: Partial<IEvent<any>>;
    org?: Partial<IOrg>;
    topic?: ITopic;
    user?: Partial<IUser>;
    onClick?: (() => void) | null;
    tooltipProps?: Partial<TooltipProps>;
  }) => {
  const router = useRouter();

  if (!org && !event && !user && !topic) return null;

  let entityUrl = org
    ? org.orgUrl
    : event
    ? event.eventUrl
    : typeof user === "object"
    ? user.userName
    : "";
  let hasLink = entityUrl !== "" && onClick !== null;

  if (topic) {
    entityUrl = `${entityUrl}/discussions/${topic.topicName}`;
  }

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
            ? "Visiter le soleil de ce koala"
            : ""
          : ""
      }
      hasArrow
      {...tooltipProps}
    >
      <span>
        <Link
          variant={hasLink ? undefined : "no-underline"}
          href={hasLink ? `/${entityUrl}` : undefined}
          onClick={() => {
            if (onClick) onClick();
            else if (entityUrl && onClick !== null)
              router.push(`/${entityUrl}`);
          }}
          data-cy={entityUrl}
        >
          <Button
            aria-hidden
            _hover={onClick ? undefined : {}}
            cursor={hasLink ? "pointer" : "default"}
            //fontSize="sm"
            leftIcon={
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
                    ? "green.500"
                    : event
                    ? "green.500"
                    : "blue.500"
                }
              />
            }
            height="auto"
            m={0}
            p={1}
            pr={2}
            // override
            textAlign="left"
            whiteSpace="normal"
            {...props}
          >
            {topic
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
              : ""}

            {topic && topic.topicVisibility.includes("Abonnés") ? (
              <Icon as={IoIosPeople} ml={2} />
            ) : org && org.orgVisibility === EOrgVisibility.PRIVATE ? (
              <Icon as={LockIcon} ml={2} />
            ) : null}
          </Button>
        </Link>
      </span>
    </Tooltip>
  );
};
