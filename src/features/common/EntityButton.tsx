import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Button,
  StyleProps,
  Icon,
  ThemingProps,
  Tooltip
} from "@chakra-ui/react";
import React from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { Link } from "features/common";
import { IOrg, orgTypeFull } from "models/Org";
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

  return (
    <Tooltip
      label={
        onClick !== null &&
        `Aller à la page ${
          org
            ? orgTypeFull(org.orgType)
            : event
            ? "l'événement"
            : user
            ? "l'utilisateur"
            : ""
        }`
      }
      hasArrow
    >
      <span>
        <Link
          href={
            onClick !== null && !topic
              ? `/${
                  org
                    ? org.orgUrl
                    : event
                    ? event.eventUrl
                    : typeof user === "object"
                    ? user.userName
                    : ""
                }`
              : undefined
          }
          shallow
          onClick={() => {
            if (onClick) onClick();
          }}
        >
          <Button
            aria-hidden
            fontSize="sm"
            leftIcon={
              <Icon
                as={
                  org
                    ? IoIosPeople
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
              ? org.orgName
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
