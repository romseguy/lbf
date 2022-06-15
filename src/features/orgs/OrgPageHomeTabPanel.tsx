import {
  AddIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EditIcon,
  HamburgerIcon,
  SmallAddIcon
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { FaRegMap, FaTree } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import {
  Column,
  EntityButton,
  EntityInfo,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { MapModal } from "features/modals/MapModal";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { InputNode } from "features/treeChart/types";
import {
  IOrg,
  orgTypeFull,
  orgTypeFull5,
  EOrgType,
  EOrgVisibility as OrgVisibility
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { hasItems } from "utils/array";
import { capitalize, sanitize, transformRTEditorOutput } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { OrgsList } from "./OrgsList";

export const OrgPageHomeTabPanel = ({
  isCreator,
  orgQuery,
  subQuery,
  setIsEdit
}: {
  isCreator: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  subQuery: AppQuery<ISubscription>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region org
  const org = orgQuery.data;
  const hasInfo =
    hasItems(org.orgAddress) ||
    hasItems(org.orgEmail) ||
    hasItems(org.orgPhone) ||
    hasItems(org.orgWeb);
  const { orgNetworks } = useGetOrgsQuery(
    { populate: "orgs" },
    {
      selectFromResult: (query) => ({
        orgNetworks: query.data?.filter(
          (o) =>
            o.orgName !== org.orgName &&
            o.orgType === EOrgType.NETWORK &&
            !!o.orgs?.find(({ orgName }) => orgName === org.orgName)
        )
      })
    }
  );
  const hasNetworks = Array.isArray(orgNetworks) && orgNetworks.length > 0;
  //#endregion

  //#region local state
  const [description, setDescription] = useState<string | undefined>();
  useEffect(() => {
    if (!org.orgDescription) return setDescription(undefined);
    const doc = transformRTEditorOutput(org.orgDescription, isMobile);
    setDescription(doc.body.innerHTML);
  }, [org]);
  const [isListOpen, setIsListOpen] = useState(true);
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
  const inputNodes: InputNode[] = useMemo(
    () =>
      org.orgs
        ? org.orgs
            .filter((o) => o.orgVisibility !== OrgVisibility.PRIVATE)
            .map((o) => ({
              name: o.orgName,
              children: o.orgs?.map(({ orgName }) => ({ name: orgName }))
            }))
        : [],
    [org.orgs]
  );
  //#endregion

  return (
    <>
      {org.orgType === EOrgType.GENERIC && hasNetworks && (
        <TabContainer>
          <TabContainerHeader
            heading={
              <>
                {/* {capitalize(orgTypeFull5(org.orgType))}{" "} */}
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

      {org.orgType === EOrgType.NETWORK && (
        <TabContainer>
          <TabContainerHeader
            heading={`
              Arbres de la planète`}
          ></TabContainerHeader>

          <TabContainerContent p={3}>
            {org.orgType === EOrgType.NETWORK && isCreator && (
              <Flex>
                <Button
                  colorScheme="teal"
                  leftIcon={
                    <>
                      <SmallAddIcon />
                      <FaTree />
                    </>
                  }
                  onClick={() => setIsEdit(true)}
                >
                  Planter un arbre
                </Button>
              </Flex>
            )}

            {orgQuery.isLoading && <Spinner />}

            {org.orgs.length > 0 ? (
              <>
                {/* <Button
                  alignSelf="flex-start"
                  colorScheme="teal"
                  leftIcon={<HamburgerIcon />}
                  rightIcon={
                    isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
                  }
                  onClick={() => setIsListOpen(!isListOpen)}
                >
                  Liste
                </Button> */}

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

                <Button
                  alignSelf="flex-start"
                  colorScheme="teal"
                  leftIcon={<IoIosGitNetwork />}
                  my={3}
                  onClick={openNetworksModal}
                >
                  Organigramme
                </Button>

                <Button
                  alignSelf="flex-start"
                  colorScheme="teal"
                  leftIcon={<FaRegMap />}
                  onClick={openMapModal}
                  mb={3}
                >
                  Carte
                </Button>

                {isNetworksModalOpen && (
                  <TreeChartModal
                    inputNodes={inputNodes}
                    isMobile={isMobile}
                    isOpen={isNetworksModalOpen}
                    rootName={org.orgName}
                    onClose={closeNetworksModal}
                  />
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
            ) : (
              <i>Aucun arbres plantés sur cette planète.</i>
            )}
          </TabContainerContent>
        </TabContainer>
      )}

      <TabContainer>
        <TabContainerHeader heading={`Coordonnées ${orgTypeFull(org.orgType)}`}>
          {hasInfo && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier les coordonnées"
              placement="bottom"
            >
              <IconButton
                aria-label="Modifier les coordonnées"
                icon={<EditIcon />}
                bg="transparent"
                _hover={{ color: "green" }}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
          )}
        </TabContainerHeader>

        <TabContainerContent p={3}>
          {hasInfo ? (
            <EntityInfo org={org} />
          ) : isCreator ? (
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() => setIsEdit(true)}
            >
              Ajouter
            </Button>
          ) : (
            <Text fontStyle="italic">Aucunes coordonnées.</Text>
          )}
        </TabContainerContent>
      </TabContainer>

      <TabContainer mb={0}>
        <TabContainerHeader heading={`Description ${orgTypeFull(org.orgType)}`}>
          {org.orgDescription && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier la description"
              placement="bottom"
            >
              <IconButton
                aria-label="Modifier la description"
                icon={<EditIcon />}
                bg="transparent"
                _hover={{ color: "green" }}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
          )}
        </TabContainerHeader>
        <TabContainerContent p={3}>
          {description && description.length > 0 ? (
            <div className="rteditor">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitize(description)
                }}
              />
            </div>
          ) : isCreator ? (
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() => setIsEdit(true)}
            >
              Ajouter
            </Button>
          ) : (
            <Text fontStyle="italic">Aucune description.</Text>
          )}
        </TabContainerContent>
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

                  {isNetworksModalOpen && (
                    <TreeChartModal
                      inputNodes={inputNodes}
                      isMobile={isMobile}
                      isOpen={isNetworksModalOpen}
                      rootName={org.orgName}
                      onClose={closeNetworksModal}
                    />
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
