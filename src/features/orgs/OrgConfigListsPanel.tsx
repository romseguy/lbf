import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridProps,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tooltip
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import { EditOrgPayload, useEditOrgMutation } from "features/api/orgsApi";
import {
  DeleteButton,
  GridHeader,
  GridItem,
  AppHeading as AppHeading,
  Link
} from "features/common";
import { EntityListForm } from "features/forms/EntityListForm";
import { breakpoints } from "features/layout/theme";
import {
  addOrReplaceList,
  defaultLists,
  editList,
  getLists,
  IOrg,
  IOrgList
} from "models/Org";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";
import { OrgConfigVisibility } from "./OrgConfigPanel";
import { belongs } from "utils/belongs";
import { useEditSubscriptionMutation } from "features/api/subscriptionsApi";

export const OrgConfigListsPanel = ({
  orgQuery,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  OrgConfigVisibility & {
    orgQuery: AppQueryWithData<IOrg>;
  }) => {
  const toast = useToast({ position: "top" });

  //#region org
  const org = orgQuery.data;
  const [editOrg] = useEditOrgMutation();
  const [editSubscription] = useEditSubscriptionMutation();
  //#endregion

  //#region local state
  const lists = getLists(org);
  const [isAdd, setIsAdd] = useState(false);
  const [listToEdit, setListToEdit] = useState<IOrgList>();
  const [listToShow, setListToShow] = useState<IOrgList>();
  useEffect(
    function onListsChange() {
      if (!hasItems(lists)) {
        toggleVisibility("lists", false);
      }
    },
    [lists]
  );
  //#endregion

  const onSubmit = async (form: IOrgList) => {
    try {
      // TODO
      // despite ... :
      // OrgSchema.orgLists.listName.unique = true
      if (listToEdit && listToEdit.listName !== form.listName)
        for (const orgList of org.orgLists)
          if (orgList.listName === form.listName)
            throw { listName: "Ce nom n'est pas disponible." };

      for (const sub of listToEdit?.subscriptions || []) {
        if (
          !belongs(
            sub._id,
            form.subscriptions.map(({ _id }) => _id)
          )
        ) {
          console.log(
            "listToEdit.sub._id",
            sub._id,
            " no longer belongs to",
            form.subscriptions
          );
          // => remove org sub from sub._id.orgs
          await editSubscription({
            payload: {
              ...sub,
              orgs: sub.orgs?.filter((orgSubscription) => {
                orgSubscription.orgId !== org._id;
              })
            }
          }).unwrap();
        }
      }

      await editOrg({
        orgId: org._id,
        payload: {
          orgLists:
            listToEdit && listToEdit.listName !== form.listName
              ? editList(org, listToEdit, form)
              : addOrReplaceList(org, form)
        }
      }).unwrap();
      setIsAdd(false);

      if (listToEdit)
        toast({ status: "success", title: "La liste a été modifiée !" });
      else {
        toggleVisibility("lists");
        toast({ status: "success", title: "La liste a été ajoutée !" });
      }
    } catch (error) {
      if (listToEdit)
        toast({ status: "error", title: "La liste n'a pas pu être modifiée" });
      else
        toast({ status: "error", title: "La liste n'a pas pu être ajoutée" });

      throw error;
    }
  };

  return (
    <Grid {...props}>
      <Link
        onClick={() => {
          toggleVisibility("lists");
          if (!hasItems(lists)) setIsAdd(!isAdd);
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.lists && !isAdd ? "lg" : undefined}
          dark={{
            _hover: {
              bg: "whiteAlpha.400"
            }
          }}
          light={{
            _hover: {
              bg: "orange.200"
            }
          }}
        >
          <Grid templateColumns="1fr auto" alignItems="center">
            <GridItem
              css={css`
                // @media (max-width: ${breakpoints.nav}) {
                //   & {
                    padding-top: 12px;
                    padding-bottom: 12px;
                  }
                //}
              `}
            >
              <Flex alignItems="center">
                {isVisible.lists || isAdd ? (
                  <FaFolderOpen size={24} color="white" />
                ) : (
                  <FaFolder />
                )}
                <Heading size="sm" ml={2}>
                  {lists
                    ? `${lists.length} liste${lists.length !== 1 ? "s" : ""}`
                    : "0 listes"}
                </Heading>
              </Flex>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }} p={5}>
          <AppHeading smaller mb={3}>
            Ajouter une liste
          </AppHeading>

          <EntityListForm
            allOptionLabel="Tous les participants"
            org={org}
            onSubmit={onSubmit}
          />
        </GridItem>
      )}

      {isVisible.lists &&
        (orgQuery.isLoading ? (
          <Text>Chargement des listes...</Text>
        ) : (
          hasItems(lists) && (
            <GridItem
              light={{ bg: "orange.50" }}
              dark={{ bg: "whiteAlpha.500" }}
              overflowX="auto"
              aria-hidden
            >
              <Table
                css={css`
                  @media (max-width: 700px) {
                    td {
                      padding: 6px;
                    }
                  }
                `}
              >
                <Thead>
                  <Tr>
                    <Th>Nom de la liste</Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {lists?.map((list, index) => {
                    const { listName, subscriptions } = list;

                    return (
                      <Tr key={`list-${index}`}>
                        <Td>{listName}</Td>

                        <Td whiteSpace="nowrap">
                          {/* <Link
                            cursor="pointer"
                            variant="underline"
                            onClick={() => {
                              setListToShow(list);
                            }}
                            data-cy="org-list-link"
                          > */}
                          {subscriptions.length}{" "}
                          {listName === "Abonnés"
                            ? "abonné"
                            : listName === "Participants"
                            ? "participant"
                            : "personne"}
                          {subscriptions &&
                            (!subscriptions.length ||
                              subscriptions.length > 1) &&
                            "s"}
                          {/* </Link> */}
                        </Td>

                        <Td textAlign="right" whiteSpace="nowrap">
                          <>
                            <Tooltip
                              label={`Modifier la liste ${listName}`}
                              placement="left"
                            >
                              <IconButton
                                aria-label={`Modifier la liste ${listName}`}
                                icon={<EditIcon />}
                                colorScheme="green"
                                variant="outline"
                                mr={3}
                                onClick={async () => {
                                  setListToEdit(list);
                                }}
                              />
                            </Tooltip>

                            {!defaultLists.includes(list.listName) && (
                              <DeleteButton
                                header={
                                  <>
                                    Êtes vous sûr de vouloir supprimer la liste{" "}
                                    <Text
                                      display="inline"
                                      color="red"
                                      fontWeight="bold"
                                    >
                                      {listName}
                                    </Text>{" "}
                                    ?
                                  </>
                                }
                                isIconOnly
                                isSmall={false}
                                label="Supprimer"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await editOrg({
                                      orgId: org._id,
                                      payload: [`orgLists.listName=${listName}`]
                                    }).unwrap();
                                  } catch (error) {
                                    console.error(error);
                                    toast({
                                      status: "error",
                                      title:
                                        "La liste n'a pas pu être supprimée"
                                    });
                                  }
                                }}
                                data-cy={`org-list-${listName}-remove`}
                              />
                            )}
                          </>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>

              {(listToEdit || listToShow) && (
                <Modal
                  isOpen
                  onClose={() => {
                    setListToEdit(undefined);
                    setListToShow(undefined);
                  }}
                >
                  <ModalOverlay />
                  <ModalContent maxWidth={listToEdit && "xl"}>
                    <ModalHeader>
                      {listToEdit && (
                        <Flex alignItems="center">
                          <EditIcon mr={3} />{" "}
                          {`Modifier la liste : ${listToEdit.listName}`}
                        </Flex>
                      )}
                      {listToShow && (
                        <Flex alignItems="center">
                          <HamburgerIcon mr={3} /> {`${listToShow.listName}`}
                        </Flex>
                      )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {listToEdit && (
                        <EntityListForm
                          allOptionLabel="Tous les participants"
                          list={listToEdit}
                          org={org}
                          onCancel={() => setListToEdit(undefined)}
                          onSubmit={async (payload) => {
                            await onSubmit(payload);
                            setListToEdit(undefined);
                          }}
                        />
                      )}

                      {listToShow && (
                        <>
                          {Array.isArray(listToShow.subscriptions) &&
                          listToShow.subscriptions.length > 0 ? (
                            <Table>
                              <Tbody>
                                {listToShow.subscriptions.map(
                                  (subscription) => {
                                    const label =
                                      subscription.email ||
                                      subscription.phone ||
                                      (typeof subscription.user === "object"
                                        ? subscription.user.email
                                        : "");

                                    return (
                                      <Tr key={subscription._id}>
                                        <Td pl={0}>{label}</Td>
                                      </Tr>
                                    );
                                  }
                                )}
                              </Tbody>
                            </Table>
                          ) : (
                            <Text>Cette liste est vide.</Text>
                          )}
                        </>
                      )}
                    </ModalBody>
                  </ModalContent>
                </Modal>
              )}
            </GridItem>
          )
        ))}
    </Grid>
  );
};

{
  /* <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    grid-column: 1;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Button
                colorScheme={isAdd ? "red" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  toggleVisibility("lists", false);
                }}
                m={1}
                data-cy="org-list-add"
              >
                {isAdd ? "Annuler" : "Ajouter"}
              </Button>
            </GridItem> */
}
