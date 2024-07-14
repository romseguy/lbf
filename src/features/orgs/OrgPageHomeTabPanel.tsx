import {
  SmallAddIcon,
  EditIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  BadgeProps,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FaGlobeEurope,
  FaMapMarkedAlt,
  FaNewspaper,
  FaRecycle,
  FaRegMap,
  FaTree
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Column,
  EditIconButton,
  EntityButton,
  EntityInfo,
  Link,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { MapModal } from "features/modals/MapModal";
import {
  IOrg,
  getNetworks,
  orgTypeFull,
  EOrgType,
  orgTypeFull2
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { useAppDispatch } from "store";
import { selectIsMobile } from "store/uiSlice";
import { getItem, hasItems } from "utils/array";
import { Session } from "utils/auth";
import { normalize, sanitize, transformRTEditorOutput } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EOrderKey, OrgsList } from "./OrgsList";
import { IsEditConfig } from "./OrgPage";

export const OrgPageHomeTabPanel = ({
  isCreator,
  orgQuery,
  session,
  setIsEdit,
  subQuery
}: {
  isCreator: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  session: Session | null;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 2
  };

  //#region org
  const org = orgQuery.data;
  const hasInfo =
    hasItems(org.orgAddress) ||
    hasItems(org.orgEmail) ||
    hasItems(org.orgPhone) ||
    hasItems(org.orgWeb);
  const [orgNetworks, setOrgNetworks] = useState<IOrg[]>([]);
  useEffect(() => {
    (async () => {
      if (org.orgType === EOrgType.GENERIC) {
        const networks = await getNetworks(org, session, dispatch);
        setOrgNetworks(networks || []);
      } else setOrgNetworks([]);
    })();
  }, [org]);
  //#endregion

  //#region local state
  const [description, setDescription] = useState<string | undefined>(
    org.orgDescription
  );
  useEffect(() => {
    if (!org.orgDescription) return setDescription(undefined);
    const newDoc = isMobile
      ? transformRTEditorOutput(org.orgDescription)
      : new DOMParser().parseFromString(org.orgDescription, "text/html");
    const newDescription = newDoc.body.innerHTML;
    if (description !== newDescription) setDescription(newDescription);
  }, [org]);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });
  //#endregion

  useEffect(() => {
    const section = normalize(getItem(router.query.name, 1));
    setIsChildrenOpen(section === "foret");
    setIsInfoOpen(section === "info");
  }, [router.asPath]);

  return (
    <>
      {org.orgType === EOrgType.NETWORK && (
        <TabContainer borderBottomRadius={isChildrenOpen ? undefined : "lg"}>
          <TabContainerHeader
            borderBottomRadius={isChildrenOpen ? undefined : "lg"}
            onClick={() =>
              router.push(
                `${org.orgUrl}${isChildrenOpen ? "" : "/foret"}`,
                `${org.orgUrl}${isChildrenOpen ? "" : "/foret"}`,
                { shallow: true }
              )
            }
          >
            <Icon
              as={isChildrenOpen ? ChevronUpIcon : ChevronRightIcon}
              boxSize={6}
              ml={3}
              mr={1}
            />
            <Heading size="sm">Forêt de la planète</Heading>
            <Badge {...badgeProps}>{org.orgs.length}</Badge>
          </TabContainerHeader>

          {isChildrenOpen && (
            <TabContainerContent p={3}>
              {orgQuery.isLoading ? (
                <Spinner />
              ) : (
                <>
                  {hasItems(org.orgs) ? (
                    <>
                      <Flex>
                        <Button
                          alignSelf="flex-start"
                          colorScheme="teal"
                          isDisabled={
                            !org.orgs.find(
                              ({ orgLat, orgLng }) => !!orgLat && !!orgLng
                            )
                          }
                          leftIcon={<FaRegMap />}
                          onClick={openMapModal}
                        >
                          Carte
                        </Button>

                        {isMapModalOpen && (
                          <MapModal
                            isOpen={isMapModalOpen}
                            header="Carte de la planète"
                            orgs={
                              org.orgs.filter(
                                (org) =>
                                  typeof org.orgLat === "number" &&
                                  typeof org.orgLng === "number" &&
                                  org.orgUrl !== "forum"
                              ) || []
                            }
                            onClose={closeMapModal}
                          />
                        )}
                      </Flex>

                      {isListOpen && (
                        <>
                          <Column
                            borderBottomRadius={0}
                            maxWidth={undefined}
                            mt={3}
                            //bg={isDark ? "gray.700" : "lightcyan"}
                          >
                            <OrgsList
                              data={org.orgs}
                              keys={
                                isMobile
                                  ? (orgType) => [
                                      {
                                        key: EOrderKey.orgName,
                                        label: `Nom de ${orgTypeFull(orgType)}`
                                      },
                                      {
                                        key: EOrderKey.latestActivity,
                                        label: "Dernier message"
                                      }
                                    ]
                                  : (orgType) => [
                                      {
                                        key: EOrderKey.orgName,
                                        label: `Nom de ${orgTypeFull(orgType)}`
                                      },
                                      {
                                        key: EOrderKey.latestActivity,
                                        label: "Dernier message"
                                      },
                                      {
                                        key: EOrderKey.createdAt,
                                        label: "Créé il y a"
                                      }
                                    ]
                              }
                              //subQuery={subQuery}
                              orgType={EOrgType.GENERIC}
                            />
                          </Column>

                          {session && (
                            <Button
                              borderTopRadius={0}
                              colorScheme="teal"
                              leftIcon={<FaRecycle />}
                              onClick={() => setIsEdit({ isAddingChild: true })}
                            >
                              Gérer la forêt
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  ) : isCreator || org.orgPermissions?.anyoneCanAddChildren ? (
                    <Tooltip
                      placement="right"
                      label="Planter un arbre dans la forêt de la planète"
                    >
                      <IconButton
                        aria-label="Planter un arbre dans la forêt de la planète"
                        alignSelf="flex-start"
                        colorScheme="teal"
                        icon={
                          <>
                            <SmallAddIcon />
                            <FaTree />
                          </>
                        }
                        pr={1}
                        onClick={() => setIsEdit({ isAddingChild: true })}
                      />
                    </Tooltip>
                  ) : (
                    <i>Aucune forêt.</i>
                  )}
                </>
              )}
            </TabContainerContent>
          )}
        </TabContainer>
      )}

      {org.orgType === EOrgType.TREETOOLS && !org.orgLat && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Text>
            Cet arbre est un <b>noisettier</b>, sa vocation première est de
            rendre disponible du matériel (prêt, location, don) à son voisinage,
            veuillez donc{" "}
            <Link
              variant="underline"
              onClick={() => setIsEdit({ isAddingInfo: true })}
            >
              indiquer sa localisation
            </Link>
            .
          </Text>
        </Alert>
      )}

      <TabContainer borderBottomRadius={isInfoOpen ? undefined : "lg"}>
        <TabContainerHeader
          borderBottomRadius={isInfoOpen ? undefined : "lg"}
          onClick={() =>
            router.push(
              `${org.orgUrl}${isInfoOpen ? "" : "/info"}`,
              `${org.orgUrl}${isInfoOpen ? "" : "/info"}`,
              { shallow: true }
            )
          }
        >
          <Icon
            as={isInfoOpen ? ChevronUpIcon : ChevronRightIcon}
            boxSize={6}
            ml={3}
            mr={1}
          />
          <Heading size="sm">Métadonnées {orgTypeFull(org.orgType)}</Heading>
          <Badge {...badgeProps}>
            {org.orgAddress.length +
              org.orgEmail.length +
              org.orgPhone.length +
              org.orgWeb.length}
          </Badge>
          {hasInfo && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier les métadonnées"
              placement="bottom"
            >
              <IconButton
                aria-label="Modifier les métadonnées"
                icon={<EditIcon />}
                bg="transparent"
                height="auto"
                _hover={{ color: "green" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEdit({ isAddingInfo: true });
                }}
              />
            </Tooltip>
          )}
        </TabContainerHeader>

        {isInfoOpen && (
          <TabContainerContent p={3}>
            {hasInfo ? (
              <EntityInfo org={org} />
            ) : isCreator ? (
              <Tooltip
                placement="right"
                label={`Ajouter des métadonnées ${orgTypeFull2(org.orgType)}`}
              >
                <IconButton
                  aria-label={`Ajouter des métadonnées ${orgTypeFull2(
                    org.orgType
                  )}`}
                  alignSelf="flex-start"
                  colorScheme="teal"
                  icon={
                    <>
                      <SmallAddIcon />
                      <FaMapMarkedAlt />
                    </>
                  }
                  pr={1}
                  onClick={() => setIsEdit({ isAddingInfo: true })}
                />
              </Tooltip>
            ) : (
              <Text fontStyle="italic">Aucunes métadonnées.</Text>
            )}
          </TabContainerContent>
        )}
      </TabContainer>

      {(orgNetworks.length > 0 ||
        (session && org.orgType === EOrgType.GENERIC)) && (
        <TabContainer>
          <TabContainerHeader
            heading={
              orgNetworks.length > 0
                ? "Planètes sur lesquelles cet arbre a été planté"
                : "Cet arbre n'a pas encore été planté"
            }
          ></TabContainerHeader>
          <TabContainerContent p={3}>
            <List>
              {orgNetworks.map((orgNetwork, i) => (
                <ListItem key={`org-network-${i}`} mt={i !== 0 ? 3 : 0}>
                  <EntityButton org={orgNetwork} />
                </ListItem>
              ))}
            </List>
            <Tooltip
              placement="right"
              label="Planter l'arbre sur la planète de votre choix"
            >
              <IconButton
                aria-label="Planter l'arbre sur la planète de votre choix"
                alignSelf="flex-start"
                colorScheme="teal"
                icon={
                  <>
                    <SmallAddIcon />
                    <FaGlobeEurope />
                  </>
                }
                mt={orgNetworks.length > 0 ? 3 : 0}
                pr={1}
                onClick={() => setIsEdit({ isAddingToNetwork: true })}
              />
            </Tooltip>
          </TabContainerContent>
        </TabContainer>
      )}

      <TabContainer
        borderBottomRadius={isDescriptionOpen ? undefined : "lg"}
        mb={0}
      >
        <TabContainerHeader
          borderBottomRadius={isDescriptionOpen ? undefined : "lg"}
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
        >
          <Icon
            as={isDescriptionOpen ? ChevronUpIcon : ChevronRightIcon}
            boxSize={6}
            ml={3}
            mr={1}
          />

          <Heading size="sm">
            {`${
              org.orgType === EOrgType.TREETOOLS ? "Matériel" : "Description"
            } ${orgTypeFull(org.orgType)}`}
          </Heading>

          {org.orgDescription && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier la description"
              placement="bottom"
            >
              <span>
                <EditIconButton
                  aria-label="Modifier la description"
                  {...(isMobile ? {} : {})}
                  ml={3}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit({ isAddingDescription: true });
                  }}
                />
              </span>
            </Tooltip>
          )}
        </TabContainerHeader>

        {isDescriptionOpen && (
          <TabContainerContent
            //bg={isDark ? "gray.600" : "#F7FAFC"}
            p={3}
          >
            {description && description.length > 0 ? (
              <div className="rteditor">
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitize(description)
                  }}
                />
              </div>
            ) : isCreator ? (
              <Tooltip
                placement="right"
                label={`Ajouter une description ${orgTypeFull2(org.orgType)}`}
              >
                <IconButton
                  aria-label={`Ajouter une description ${orgTypeFull2(
                    org.orgType
                  )}`}
                  alignSelf="flex-start"
                  colorScheme="teal"
                  icon={
                    <>
                      <SmallAddIcon />
                      <FaNewspaper />
                    </>
                  }
                  pr={1}
                  onClick={() => setIsEdit({ isAddingDescription: true })}
                />
              </Tooltip>
            ) : (
              <Text fontStyle="italic">Aucune description.</Text>
            )}
          </TabContainerContent>
        )}
      </TabContainer>
    </>
  );
};

{
  /*
const orgsWithLocation = org.orgs.filter(({ orgLat, orgLng }) => !!orgLat && !!orgLng);
{orgsWithLocation.length > 0 && (
  <TabContainer>
    <TabContainerHeader heading="Carte du réseau">
      {isCreator && (
        <Tooltip
          hasArrow
          label="Ajouter ou supprimer des organisations du réseau"
          placement="bottom"
        >
          <IconButton
            aria-label="Ajouter ou supprimer des organisations du réseau"
            icon={<EditIcon />}
            bg="transparent"
            _hover={{ color: "green" }}
            onClick={() => setIsEdit(true)}
          />
        </Tooltip>
      )}
    </TabContainerHeader>
    <TabContainerContent>
      <MapContainer
        orgs={orgsWithLocation}
        center={{
          lat: orgsWithLocation[0].orgLat,
          lng: orgsWithLocation[0].orgLng
        }}
      />
    </TabContainerContent>
  </TabContainer>
)}

{Array.isArray(org.orgs) && org.orgs.length > 0 && (
  <TabContainer>
    <TabContainerHeader heading="Membres du réseau">
      {isCreator && (
        <Tooltip
          hasArrow
          label="Ajouter ou supprimer des organisations du réseau"
          placement="bottom"
        >
          <IconButton
            aria-label="Ajouter ou supprimer des organisations du réseau"
            icon={<EditIcon />}
            bg="transparent"
            _hover={{ color: "green" }}
            onClick={() => setIsEdit(true)}
          />
        </Tooltip>
      )}
    </TabContainerHeader>
    <TabContainerContent>
      {[...org.orgs]
        .sort((a, b) => {
          if (a.orgName > b.orgName) return -1;
          if (a.orgName < b.orgName) return 1;
          return 0;
        })
        .map((childOrg, index) => {
          return (
            <Flex>
              <EntityButton
                org={childOrg}
                mb={
                  index === org.orgs!.length - 1 ? 3 : 0
                }
                mt={3}
                mx={3}
              />
            </Flex>
          );
        })}
    </TabContainerContent>
  </TabContainer>
)}
*/
}

{
  /*
        <TabContainer>
          <TabContainerHeader
            heading={
              orgQuery.isLoading
                ? "Chargement..."
                : `${
                    org.orgs.length > 0
                      ? `Les arbres plantés`
                      : `Aucun arbres plantés`
                  } sur la planète ${org.orgName}`
            }
          >
            {isCreator && (
              <Tooltip
                hasArrow
                label={`Planter ${
                  org.orgs.length > 0 ? "ou déraciner" : ""
                } des arbres de la planète ${org.orgName}`}
                placement="bottom"
              >
                <IconButton
                  aria-label={`Planter ${
                    org.orgs.length > 0 ? "ou déraciner" : ""
                  } des arbres de la planète ${org.orgName}`}
                  icon={
                    org.orgs.length > 0 ? (
                      <EditIcon />
                    ) : (
                      <>
                        <SmallAddIcon />
                        <FaTree />
                      </>
                    )
                  }
                  my={2}
                  ml={1}
                  minWidth={0}
                  height="auto"
                  _hover={{ color: "green" }}
                  onClick={() => setIsEdit(true)}
                />
              </Tooltip>
            )}
          </TabContainerHeader>

          {org.orgs.length > 0 && (
            <TabContainerContent p={3}>
              {orgQuery.isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Button
                    alignSelf="flex-start"
                    colorScheme="teal"
                    leftIcon={<IoIosGitNetwork />}
                    mb={5}
                    onClick={openNetworksModal}
                  >
                    Arborescence
                  </Button>

                  <Button
                    alignSelf="flex-start"
                    colorScheme="teal"
                    leftIcon={<FaRegMap />}
                    onClick={openMapModal}
                    mb={5}
                  >
                    Carte
                  </Button>

                  <Button
                    alignSelf="flex-start"
                    colorScheme="teal"
                    leftIcon={<HamburgerIcon />}
                    rightIcon={
                      isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
                    }
                    onClick={() => setIsListOpen(!isListOpen)}
                  >
                    Liste
                  </Button>

                  {isListOpen && (
                    <Column
                      maxWidth={undefined}
                      mt={3}
                      bg={isDark ? "gray.400" : "lightcyan"}
                    >
                      <OrgsList
                        query={orgQuery}
                        subQuery={subQuery}
                        orgType={EOrgType.GENERIC}
                      />
                    </Column>
                  )}

                  {isMapModalOpen && (
                    <MapModal
                      isOpen={isMapModalOpen}
                      header="Carte des réseaux"
                      orgs={
                        org.orgs.filter(
                          (org) =>
                            typeof org.orgLat === "number" &&
                            typeof org.orgLng === "number" &&
                            org.orgUrl !== "forum"
                        ) || []
                      }
                      onClose={closeMapModal}
                    />
                  )}
                </>
              )}
            </TabContainerContent>
          )}
        </TabContainer>
 */
}

{
  /*
  <Button
    alignSelf="flex-start"
    colorScheme="teal"
    leftIcon={<IoIosGitNetwork />}
    my={3}
    onClick={openNetworksModal}
  >
    Organigramme
  </Button>
   */
}

{
  /* {org.orgType === EOrgType.GENERIC && hasNetworks && (
        <TabContainer>
          <TabContainerHeader
            heading={
              <>
                <EntityButton org={org} onClick={null} /> est planté sur la
                planète :
              </>
            }
          />
          <TabContainerContent p={3}>
            {orgNetworks.map((network) => (
              <Flex key={network._id}>
                <EntityButton org={network} mb={1} />
              </Flex>
            ))}
          </TabContainerContent>
        </TabContainer>
      )}
    */
}
