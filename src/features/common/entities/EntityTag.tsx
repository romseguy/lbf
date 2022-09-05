import {
  Box,
  Flex,
  Tag,
  TagCloseButton,
  TagProps,
  Text,
  useColorMode
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DeleteButton } from "features/common";
import { useDeleteEventMutation } from "features/api/eventsApi";
import { useDeleteOrgMutation } from "features/api/orgsApi";
import { IEntity, isEvent } from "models/Entity";
import { orgTypeFull5, IOrg } from "models/Org";

export const EntityTag = ({
  body,
  entity,
  onClick,
  onCloseClick,
  ...props
}: {
  body?: React.ReactNode;
  entity: IEntity;
  label?: string;
  onCloseClick?: () => void;
} & TagProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isE = isEvent(entity);
  const [isLoading, setIsLoading] = useState(false);
  const canDelete = !!onCloseClick;

  const [deleteOrg, _] = useDeleteOrgMutation();
  const [deleteEvent, __] = useDeleteEventMutation();
  const deleteEntity = isE ? deleteEvent : deleteOrg;
  const index = entity._id;
  const isSelected = false;
  const label = props.label
    ? props.label
    : isE
    ? entity.eventName
    : (entity as IOrg).orgName;

  return (
    <Tag
      bg={
        isSelected
          ? isDark
            ? "pink.200"
            : "pink.500"
          : isDark
          ? "#81E6D9"
          : "#319795"
      }
      color={isDark ? "black" : "white"}
      cursor="pointer"
      fontWeight="normal"
      mr={1}
      p={0}
      _hover={{
        bg: isSelected
          ? isDark
            ? "pink.300"
            : "pink.600"
          : isDark
          ? "#4FD1C5"
          : "#2C7A7B"
      }}
      onClick={(e) => {
        onClick && onClick(e);
      }}
      {...props}
    >
      {body ? (
        body
      ) : (
        <Flex alignItems="center" p={2}>
          <Text fontWeight="bold">{label}</Text>
        </Flex>
      )}

      {canDelete && (
        <Box
          borderColor={isDark ? "#BAC1CB" : "gray.500"}
          borderLeftWidth="1px"
          pr={3}
        >
          <TagCloseButton
            onClick={() => {
              onCloseClick && onCloseClick();
            }}
          />
        </Box>
      )}
    </Tag>
  );
};

{
  /*
  <DeleteButton
    color={isDark ? "black" : "white"}
    isIconOnly
    // tooltip props
    hasArrow
    label="Supprimer la catégorie"
    placement="right"
    // other props
    header={
      <>
        Êtes vous sûr de vouloir supprimer{" "}
        {isE ? "l'événement" : orgTypeFull5((entity as IOrg).orgType)}{" "}
        {label} ?
      </>
    }
    //isLoading={isLoading[`entity-${index}`]}
    isLoading={isLoading}
    onClick={async () => {
      //setIsLoading({ [`entity-${index}`]: true });
      setIsLoading(true);
      try {
        const deletedEntity = await deleteEntity(entity._id).unwrap();
      } catch (error) {
        setIsLoading(false);
        //setIsLoading({ [`entity-${index}`]: false });
        console.error(error);
      }
    }}
  />
*/
}
