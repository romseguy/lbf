import { CalendarIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import React from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { IOrg } from "models/Org";
import { IEvent } from "models/Event";
import { IUser } from "models/User";

export const EntityBadge = ({
  event,
  org,
  user,
  onClick,
  ...props
}: ButtonProps & {
  event?: Partial<IEvent>;
  org?: Partial<IOrg>;
  user?: Partial<IUser>;
  onClick: () => void;
}) => {
  if (!org && !event && !user) return null;

  return (
    <Button
      fontSize="sm"
      leftIcon={
        <Icon
          as={org ? IoIosPeople : event ? CalendarIcon : IoIosPerson}
          color={org || event ? "green.500" : "blue.500"}
        />
      }
      height="auto"
      m={0}
      onClick={onClick}
      {...props}
    >
      {org ? org.orgName : event ? event.eventName : user?.userName}
    </Button>
  );
};
