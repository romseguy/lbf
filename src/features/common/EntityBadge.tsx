import { CalendarIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import React from "react";
import { IoIosPeople } from "react-icons/io";
import { IOrg } from "models/Org";
import { IEvent } from "models/Event";

export const EntityBadge = ({
  event,
  org,
  onClick,
  ...props
}: ButtonProps & {
  event?: Partial<IEvent>;
  org?: Partial<IOrg>;
  onClick: () => void;
}) => {
  if (!org && !event) return null;

  return (
    <Button
      fontSize="sm"
      leftIcon={
        <Icon as={org ? IoIosPeople : CalendarIcon} color="green.500" />
      }
      height="auto"
      m={0}
      onClick={onClick}
      {...props}
    >
      {org ? org.orgName : event ? event.eventName : ""}
    </Button>
  );
};
