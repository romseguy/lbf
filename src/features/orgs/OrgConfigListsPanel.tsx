import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon
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
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import {
  DeleteButton,
  EntityListForm,
  GridHeader,
  GridItem,
  Link
} from "features/common";
import { getSubscriptions, IOrg, IOrgList } from "models/Org";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { breakpoints } from "theme/theme";
import { Visibility } from "./OrgPage";
import { useEditOrgMutation } from "./orgsApi";

export const OrgConfigListsPanel = ({
  org,
  orgQuery,
  isVisible,
  setIsVisible,
  session
}: GridProps &
  Visibility & {
    org: IOrg;
    orgQuery: any;
    session: Session;
  }) => {
  const toast = useToast({ position: "top" });

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  //#endregion

  //#region local state
  const lists: IOrgList[] = (org.orgLists || []).concat([
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

  const onSubmit = async (form: {
    listName: string;
    subscriptions?: ISubscription[];
  }) => {
    if (form.listName === "Abonnés" || form.listName === "Adhérents")
      throw { listName: "Ce nom n'est pas disponible." };

    let orgLists = [...(org.orgLists || [])];

    if (listToEdit?.listName !== form.listName)
      for (const orgList of orgLists)
        if (orgList.listName === form.listName)
          throw { listName: "Ce nom n'est pas disponible." };

    try {
      let found = false;
      orgLists = orgLists.map((orgList) => {
        if (orgList.listName === form.listName) {
          found = true;
          return { ...orgList, subscriptions: form.subscriptions };
        }
        return orgList;
      });
      if (!found) orgLists = [...orgLists, form];

      await editOrg({
        payload: {
          orgLists
        },
        orgUrl: org.orgUrl
      }).unwrap();
      orgQuery.refetch();
      setIsAdd(false);
      setIsVisible({ ...isVisible, lists: true });

      if (listToEdit)
        toast({ status: "success", title: "La liste a bien été modifiée !" });
      else toast({ status: "success", title: "La liste a bien été ajoutée !" });
    } catch (error) {
      if (listToEdit)
        toast({ status: "error", title: "La liste n'a pas pu être modifiée" });
      else
        toast({ status: "error", title: "La liste n'a pas pu être ajoutée" });

      throw error;
    }
  };

  return (
    <Grid>
      <Link
        variant="no-underline"
        onClick={() => {
          if (!hasItems(lists)) setIsAdd(!isAdd);
          setIsVisible({
            banner: false,
            lists: hasItems(lists) ? !isVisible.lists : false,
            logo: false,
            subscribers: false
          });
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
                  (isVisible.lists ? <FaFolderOpen /> : <FaFolder />)}
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
                data-cy="org-list-add"
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
        ) : lists.length > 0 ? (
          <GridItem
            light={{ bg: "orange.100" }}
            dark={{ bg: "gray.500" }}
            overflowX="auto"
            aria-hidden
          >
            {session.user.isAdmin && (
              <Button
                onClick={async () => {
                  await editOrg({
                    orgUrl: org.orgUrl,
                    payload: { orgLists: [] }
                  }).unwrap();

                  orgQuery.refetch();
                }}
              >
                RAZ
              </Button>
            )}

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
                  <Th>Nom</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>

              <Tbody>
                {lists.map((list, index) => {
                  const { listName, subscriptions } = list;
                  const hasSubscriptions =
                    subscriptions && subscriptions.length > 0;
                  const s =
                    subscriptions &&
                    (subscriptions.length > 1 || !subscriptions.length)
                      ? "s"
                      : "";

                  return (
                    <Tr key={`list-${index}`}>
                      <Td>{listName}</Td>

                      <Td whiteSpace="nowrap">
                        <Link
                          cursor={hasSubscriptions ? "pointer" : "default"}
                          variant={
                            hasSubscriptions ? "underline" : "no-underline"
                          }
                          onClick={() => {
                            if (hasSubscriptions) setListToShow(list);
                          }}
                          data-cy="org-list-link"
                        >
                          {hasSubscriptions ? subscriptions.length : 0} membre
                          {hasSubscriptions ? s : "s"}
                        </Link>
                      </Td>

                      <Td textAlign="right" whiteSpace="nowrap">
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
                                minWidth={0}
                                mr={3}
                                onClick={async () => {
                                  setListToEdit(list);
                                }}
                                data-cy={`org-list-${listName}-edit`}
                              />
                            </Tooltip>

                            <Tooltip
                              label="Supprimer la liste"
                              hasArrow
                              placement="top"
                            >
                              <DeleteButton
                                isIconOnly
                                hasArrow
                                placement="top"
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
                                onClick={async () => {
                                  await editOrg({
                                    payload: [`orgLists.listName=${listName}`],
                                    orgUrl: org.orgUrl
                                  });
                                  orgQuery.refetch();
                                }}
                                data-cy={`org-list-${listName}-remove`}
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
                        onSubmit={async (payload) => {
                          await onSubmit(payload);
                          setListToEdit(undefined);
                        }}
                      />
                    )}

                    {listToShow && listToShow.subscriptions && (
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
                              <Tr key={subscription._id}>
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
        ) : (
          <Text>Aucune liste de diffusion.</Text>
        ))}
    </Grid>
  );
};
