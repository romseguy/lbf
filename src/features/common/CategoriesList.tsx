import { Spinner, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";
import { DeleteButton } from "features/common";
import { useEditEventMutation } from "features/api/eventsApi";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  IEntity,
  IEntityCategory,
  IEntityCategoryKey,
  isEvent,
  isOrg
} from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const CategoriesList = ({
  categories,
  fieldName,
  query
}: {
  categories: IEntityCategory[];
  fieldName: IEntityCategoryKey;
  query: AppQueryWithData<IEntity>;
}) => {
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = query.data as IOrg;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const edit = isE ? editEvent : editOrg;

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
          categories.map(({ catId, label }) => (
            <Tr key={catId}>
              <Td>{label}</Td>
              <Td textAlign="right" whiteSpace="nowrap">
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
                  placement="bottom"
                  isIconOnly
                  onClick={async () => {
                    await edit({
                      [isE ? "eventId" : isO ? "orgId" : "entityId"]:
                        entity._id,
                      payload: {
                        [fieldName]: categories.filter(
                          (categoryToDelete) => categoryToDelete.label !== label
                        )
                      }
                    });
                  }}
                />
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};
