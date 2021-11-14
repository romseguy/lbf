import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  ViewOffIcon
} from "@chakra-ui/icons";
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
  Tooltip,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { css } from "twin.macro";
import { EntityListForm, GridHeader, GridItem, Link } from "features/common";
import { getSubscriptions, IOrg, IOrgList, orgTypeFull } from "models/Org";
import { hasItems } from "utils/array";
import { Visibility } from "./OrgPage";
import { useEditOrgMutation } from "./orgsApi";
import { breakpoints } from "theme/theme";
import { refetchEvent } from "features/events/eventSlice";
import { deleteSubscription } from "features/subscriptions/subscriptionsApi";
import subscription from "pages/api/subscription";
import { SubscriptionTypes } from "models/Subscription";

export const OrgConfigListsPanel = ({
  org,
  orgQuery,
  isVisible,
  setIsVisible
}: GridProps &
  Visibility & {
    org: IOrg;
    orgQuery: any;
  }) => {
  const toast = useToast({ position: "top" });

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  //#endregion

  //#region local state
  const lists = (org.orgLists || []).concat([
    {
      listName: "Abonnés",
      subscriptions: getSubscriptions(org, SubscriptionTypes.FOLLOWER)
    },
    {
      listName: "Adhérents",
      subscriptions: getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
    }
  ]);
  const [isAdd, setIsAdd] = useState(false);
  const [listToEdit, setListToEdit] = useState<IOrgList>();
  const [listToShow, setListToShow] = useState<IOrgList>();
  useEffect(() => {
    if (!hasItems(lists)) setIsVisible({ ...isVisible, lists: false });
  }, [lists]);
  //#endregion

  const onSubmit = async (payload: IOrgList) => {
    console.log("submitted", payload);

    try {
      await editOrg({
        payload: {
          orgLists:
            Array.isArray(org.orgLists) && org.orgLists.length > 0
              ? org.orgLists.map((orgList) => {
                  if (
                    listToEdit?.listName !== payload.listName &&
                    orgList.listName === listToEdit?.listName
                  ) {
                    return payload;
                  }

                  if (orgList.listName === payload.listName) {
                    return {
                      listName: orgList.listName,
                      subscriptions: payload.subscriptions
                    };
                  }

                  return orgList;
                })
              : [payload]
        },
        orgUrl: org.orgUrl
      }).unwrap();
      orgQuery.refetch();
      setIsAdd(false);
      setIsVisible({ ...isVisible, lists: true });
      toast({ status: "success", title: "La liste a bien été modifiée !" });
    } catch (error) {
      console.error(error);
      toast({ status: "error", title: "La liste n'a pas pu être modifiée" });
    }
  };

  return (
    <Grid>
      <Link
        variant="no-underline"
        onClick={() => {
          if (!hasItems(lists)) {
            setIsAdd(!isAdd);
            setIsVisible({
              banner: false,
              logo: false,
              subscribers: false
            });
          } else {
            setIsAdd(false);
            setIsVisible({
              lists: !isVisible.lists,
              banner: false,
              logo: false,
              subscribers: false
            });
          }
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.lists ? "lg" : undefined}
        >
          <Grid templateColumns="1fr auto" alignItems="center">
            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    padding-top: 12px;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Flex alignItems="center">
                {hasItems(lists) &&
                  (isVisible.lists ? <ViewIcon /> : <ViewOffIcon />)}
                <Heading size="sm" ml={2}>
                  Listes de diffusion
                </Heading>
              </Flex>
            </GridItem>

            <GridItem
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
                rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
                colorScheme={isAdd ? "green" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  setIsVisible({ ...isVisible, lists: false });
                }}
                m={1}
              >
                Ajouter
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }} p={5}>
          <EntityListForm
            org={org}
            onCancel={() => {
              setIsAdd(false);
            }}
            onSubmit={onSubmit}
          />
        </GridItem>
      )}

      {isVisible.lists &&
        (orgQuery.isLoading ? (
          <Text>Chargement des listes de diffusion...</Text>
        ) : (
          <GridItem
            light={{ bg: "orange.100" }}
            dark={{ bg: "gray.500" }}
            overflowX="auto"
            aria-hidden
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Nom de la liste</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>

              <Tbody>
                {lists.map((list, index) => {
                  const { listName, subscriptions } = list;
                  const s =
                    subscriptions.length > 1 || !subscriptions.length
                      ? "s"
                      : "";

                  return (
                    <Tr key={`list-${index}`}>
                      <Td>{listName}</Td>
                      <Td>
                        <Link
                          variant="underline"
                          onClick={() => {
                            setListToShow(list);
                          }}
                        >
                          {subscriptions.length} membre{s}
                        </Link>
                      </Td>

                      <Td textAlign="right">
                        {!["Abonnés", "Adhérents"].includes(list.listName) && (
                          <>
                            <Tooltip
                              label="Modifier la liste de diffusion"
                              hasArrow
                              placement="top"
                            >
                              <IconButton
                                aria-label="Modifier la liste de diffusion"
                                bg="transparent"
                                _hover={{ bg: "transparent", color: "green" }}
                                icon={<EditIcon />}
                                height="auto"
                                onClick={async () => {
                                  setListToEdit(list);
                                }}
                              />
                            </Tooltip>

                            <Tooltip
                              label="Supprimer la liste"
                              hasArrow
                              placement="top"
                            >
                              <IconButton
                                aria-label="Supprimer la liste"
                                bg="transparent"
                                _hover={{ bg: "transparent", color: "red" }}
                                icon={<DeleteIcon />}
                                height="auto"
                                minWidth={0}
                                onClick={async () => {
                                  const remove = confirm(
                                    `Êtes-vous sûr de vouloir supprimer la liste ${listName} ?`
                                  );

                                  if (remove) {
                                    await editOrg({
                                      payload: [
                                        `orgLists.listName=${listName}`
                                      ],
                                      orgUrl: org.orgUrl
                                    });
                                    orgQuery.refetch();
                                  }
                                }}
                              />
                            </Tooltip>
                          </>
                        )}
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
                    {listToEdit &&
                      `Modifier la liste de diffusion : ${listToEdit.listName}`}
                    {listToShow &&
                      `Liste de diffusion : ${listToShow.listName}`}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {listToEdit && (
                      <EntityListForm
                        list={listToEdit}
                        org={org}
                        onCancel={() => setListToEdit(undefined)}
                        onSubmit={(payload) => {
                          onSubmit(payload);
                          setListToEdit(undefined);
                        }}
                      />
                    )}

                    {listToShow && (
                      <Table>
                        <Tbody>
                          {listToShow.subscriptions.map((subscription) => {
                            const label =
                              subscription.email ||
                              subscription.phone ||
                              (typeof subscription.user === "object"
                                ? subscription.user.email
                                : "");

                            return (
                              <Tr>
                                <Td>{label}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </GridItem>
        ))}
    </Grid>
  );
};
