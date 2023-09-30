import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Spinner,
  Tooltip,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  Input
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DeleteButton } from "features/common";
import { useEditEventMutation } from "features/api/eventsApi";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  IEntity,
  IEntityCategory,
  EEntityCategoryKey,
  isEvent,
  isOrg
} from "models/Entity";
import { AppQueryWithData } from "utils/types";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

const EntityCategoriesListItem = ({
  category,
  //categoryKey,
  query,
  onDeleteClick
}: {
  category: IEntityCategory;
  //categoryKey: EEntityCategoryKey;
  query: AppQueryWithData<IEntity>;
  onDeleteClick: (label: string) => void;
}) => {
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const isMobile = useSelector(selectIsMobile);

  const { catId, label } = category;

  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);

  const [isEdit, setIsEdit] = useState(false);

  return (
    <Tr key={catId}>
      <Td>{isEdit ? <Input /> : label}</Td>
      <Td textAlign="right" whiteSpace="nowrap">
        <Tooltip placement="bottom" label="Modifier la catégorie">
          <IconButton
            aria-label="Modifier la catégorie"
            icon={<EditIcon />}
            mr={3}
            {...(isMobile
              ? {
                  colorScheme: "green"
                  //variant: "outline"
                }
              : {
                  bgColor: "transparent",
                  height: "auto",
                  _hover: { color: "green" }
                })}
            onClick={(e) => {
              setIsEdit(true);
            }}
          />
        </Tooltip>

        <DeleteButton
          header={
            <>
              Êtes-vous sûr de vouloir supprimer la catégorie{" "}
              <Text display="inline" color="red" fontWeight="bold">
                {label}
              </Text>{" "}
              ?
            </>
          }
          isIconOnly
          placement="bottom"
          {...(isMobile
            ? {
                isSmall: false
              }
            : {
                label: "Supprimer la catégorie"
              })}
          onClick={() => onDeleteClick(label)}
        />
      </Td>
    </Tr>
  );
};
export const EntityCategoriesList = ({
  categories,
  categoryKey,
  query
}: {
  categories: IEntityCategory[];
  categoryKey: EEntityCategoryKey;
  query: AppQueryWithData<IEntity>;
}) => {
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const isMobile = useSelector(selectIsMobile);

  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const edit = isE ? editEvent : editOrg;

  const onDeleteClick = async (label: string) => {
    await edit({
      [isE ? "eventId" : isO ? "orgId" : "entityId"]: entity._id,
      payload: {
        [categoryKey]: categories.filter(
          (categoryToDelete) => categoryToDelete.label !== label
        )
      }
    });
  };

  return (
    <Table>
      <Tbody>
        {query.isLoading || query.isFetching ? (
          <Tr>
            <Td>
              <Spinner boxSize={4} />
            </Td>
          </Tr>
        ) : (
          categories.map((category) => (
            <EntityCategoriesListItem
              category={category}
              //categoryKey={categoryKey}
              query={query}
              onDeleteClick={onDeleteClick}
            />
          ))
        )}
      </Tbody>
    </Table>
  );
};
