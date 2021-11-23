import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Button,
  StyleProps,
  Icon,
  ThemingProps,
  Tooltip
} from "@chakra-ui/react";
import React from "react";
import { IoIosGitNetwork, IoIosPeople, IoIosPerson } from "react-icons/io";
import { Link } from "features/common";
import { IOrg, orgTypeFull, OrgTypes } from "models/Org";
import { IEvent } from "models/Event";
import { IUser } from "models/User";
import { ITopic } from "models/Topic";
import { useRouter } from "next/router";

export const EntityButton = ({
  event,
  org,
  topic,
  user,
  onClick,
  ...props
}: ThemingProps<"Button"> &
  StyleProps & {
    event?: Partial<IEvent<any>>;
    org?: Partial<IOrg>;
    topic?: Partial<ITopic>;
    user?: Partial<IUser>;
    onClick?: (() => void) | null;
  }) => {
  const router = useRouter();

  if (!org && !event && !user && !topic) return null;

  const hasLink = org || event || user || !!onClick;

  return (
    <Tooltip
      label={
        hasLink
          ? org
            ? `Aller à la page ${orgTypeFull(org.orgType)}`
            : event
            ? "Aller à la page de l'événement"
            : user
            ? "Aller à la page de l'utilisateur"
            : ""
          : ""
      }
      hasArrow
    >
      <span>
        <Link
          variant={hasLink ? undefined : "no-underline"}
          onClick={() => {
            if (onClick) onClick();
            else if (hasLink && onClick !== null)
              router.push(
                `/${
                  org
                    ? org.orgUrl
                    : event
                    ? event.eventUrl
                    : typeof user === "object"
                    ? user.userName
                    : ""
                }`
              );
          }}
        >
          <Button
            aria-hidden
            cursor={hasLink ? "pointer" : "default"}
            fontSize="sm"
            leftIcon={
              <Icon
                as={
                  org
                    ? org.orgName === "aucourant"
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
                color={org ? "green.500" : event ? "green.500" : "blue.500"}
              />
            }
            height="auto"
            m={0}
            p={1}
            pr={2}
            {...props}
          >
            {org
              ? org.orgName === "aucourant"
                ? "Forum"
                : org.orgName
              : event
              ? event.eventName
              : user
              ? user.userName
              : topic?.topicName}
          </Button>
        </Link>
      </span>
    </Tooltip>
  );
};
