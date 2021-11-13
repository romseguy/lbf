import { CalendarIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import React from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { IOrg } from "models/Org";
import { IEvent } from "models/Event";
import { IUser } from "models/User";

export const EntityButton = ({
  event,
  org,
  user,
  onClick,
  ...props
}: ButtonProps & {
  event?: Partial<IEvent<any>>;
  org?: Partial<IOrg>;
  user?: Partial<IUser>;
  onClick?: () => void;
}) => {
  if (!org && !event && !user) return null;

  return (
    <Button
      cursor={onClick ? "pointer" : "default"}
      fontSize="sm"
      leftIcon={
        <Icon
          as={org ? IoIosPeople : event ? CalendarIcon : IoIosPerson}
          color={org || event ? "green.500" : "blue.500"}
        />
      }
      height="auto"
      m={0}
      p={1}
      pr={2}
      onClick={onClick}
      {...props}
    >
      {org ? org.orgName : event ? event.eventName : user?.userName}
    </Button>
  );
};
