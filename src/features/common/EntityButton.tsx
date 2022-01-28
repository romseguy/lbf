import { CalendarIcon, ChatIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  StyleProps,
  Icon,
  ThemingProps,
  Tooltip,
  TooltipProps
} from "@chakra-ui/react";
import React from "react";
import { IoIosGitNetwork, IoIosPeople, IoIosPerson } from "react-icons/io";
import { Link } from "features/common";
import { IOrg, orgTypeFull, OrgTypes, Visibility } from "models/Org";
import { IEvent } from "models/Event";
import { IUser } from "models/User";
import { ITopic } from "models/Topic";
import { useRouter } from "next/router";
import { FaGlobeEurope } from "react-icons/fa";

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
    topic?: Partial<ITopic>;
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
              ? `Aller à la page ${orgTypeFull(org.orgType)}`
              : ""
            : event
            ? "Aller à la page de l'événement"
            : user
            ? "Aller à la page de l'utilisateur"
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
            fontSize="sm"
            leftIcon={
              <Icon
                as={
                  topic
                    ? ChatIcon
                    : org
                    ? org.orgUrl === "forum"
                      ? ChatIcon
                      : org.orgType === OrgTypes.NETWORK
                      ? IoIosGitNetwork
                      : IoIosPeople
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
                : org.orgName
              : event
              ? event.eventName
              : user
              ? user.userName
              : ""}
            {org && org.orgUrl !== "forum" ? (
              <Icon
                as={
                  org.orgVisibility === Visibility.PRIVATE
                    ? LockIcon
                    : FaGlobeEurope
                }
                ml={2}
              />
            ) : null}
          </Button>
        </Link>
      </span>
    </Tooltip>
  );
};
