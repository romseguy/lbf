import { ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Flex,
  Select,
  Text,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { getRunningQueriesThunk } from "features/api";
import { getOrgs, useGetOrgsQuery } from "features/api/orgsApi";
import {
  Button,
  Column,
  EntityAddButton,
  AppHeading,
  HostTag,
  Link,
  LoginButton
} from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { EOrderKey, OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, EOrgVisibility, IOrg, orgTypeFull } from "models/Org";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";
import { wrapper } from "store";
import { useGetUsersQuery } from "features/api/usersApi";
import { getRefId } from "models/Entity";

const isCollapsable = true;
const initialOrgsQueryParams = {
  orgType: EOrgType.NETWORK,
  populate: "orgs orgTopics.topicMessages createdBy"
};

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();

  //#region local state
  const [isListOpen, setIsListOpen] = useState(true);
  const [selectedOrgVisibility, setSelectedOrgVisibility] = useState(
    EOrgVisibility.FRONT
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [orgsQueryParams, setOrgsQueryParams] = useState(
    initialOrgsQueryParams
  );
  const orgsQuery = useGetOrgsQuery(orgsQueryParams, {
    selectFromResult: ({ data }) => ({
      orgs: data?.filter(({ orgUrl }) => orgUrl !== "forum"),
      selectedUserOrgs: data?.filter((org) => {
        if (selectedUserId) return getRefId(org) === selectedUserId;

        if (selectedOrgVisibility === EOrgVisibility.PUBLIC) return true;

        return org.orgVisibility === selectedOrgVisibility;
      })
    })
  });
  const { orgs, selectedUserOrgs } = orgsQuery;
  const usersQuery = useGetUsersQuery(
    { select: "userName" },
    {
      selectFromResult: ({ data }) => ({
        data: data?.filter(({ _id }) => {
          const userOrg = orgs?.find((org) => getRefId(org) === _id);
          return !!userOrg;
        })
      })
    }
  );
  //#endregion

  //#region modal
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  //#endregion

  return (
    <Layout {...props} pageTitle={`Forum`}>
      <Column
        m={props.isMobile ? undefined : "0 auto"}
        maxWidth="4xl"
        p={props.isMobile ? 2 : 3}
      >
        {/* <Flex alignItems="center">
          <AppHeading mb={3}>
            Forum {process.env.NEXT_PUBLIC_SHORT_URL}
          </AppHeading>
        </Flex> */}

        <Select
          defaultValue={selectedUserId}
          mb={3}
          onChange={(e) => {
            if (!e.target.value) {
              setSelectedUserId("");
              setSelectedOrgVisibility(EOrgVisibility.FRONT);
              return;
            }

            if (e.target.value in EOrgVisibility) {
              const value = e.target.value as EOrgVisibility;
              setSelectedUserId("");
              setSelectedOrgVisibility(value);
              return;
            }

            setSelectedUserId(e.target.value);
          }}
        >
          <option value={EOrgVisibility.FRONT}>Forum commun</option>
          <option value={EOrgVisibility.PUBLIC}>Forum public</option>
          {usersQuery.data?.map(({ _id, userName }) => {
            return (
              <option key={_id} value={_id}>
                {`Forum public de ${userName}${
                  _id === session?.user.userId ? " (Vous)" : ""
                }`}
              </option>
            );
          })}
        </Select>

        {hasItems(selectedUserOrgs) ? (
          <>
            {/* <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<HamburgerIcon />}
              rightIcon={isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />}
              mb={isListOpen ? 3 : 0}
              onClick={() => setIsListOpen(!isListOpen)}
            >
              Liste
            </Button> */}

            {isListOpen && (
              <Column bg={isDark ? "gray.700" : "white"}>
                {selectedUserOrgs && (
                  <OrgsList
                    data={selectedUserOrgs}
                    keys={(orgType) => [
                      {
                        key: EOrderKey.orgName,
                        label: `Nom`
                      },
                      {
                        key: EOrderKey.latestActivity,
                        //label: "Dernière activité"
                        label: "Dernier message"
                      }
                      //{ key: EOrderKey.createdBy, label: "Créé par" }
                    ]}
                    //subQuery={subQuery}
                  />
                )}
              </Column>
            )}

            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<FaRegMap />}
              rightIcon={
                isMapModalOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
              }
              onClick={openMapModal}
              mt={3}
            >
              Carte
            </Button>
          </>
        ) : (
          <Flex>
            <EntityAddButton
              label="Ajoutez une planète"
              orgType={EOrgType.NETWORK}
              size={props.isMobile ? "xs" : "md"}
              mb={3}
            />
          </Flex>
        )}
      </Column>

      <Flex mt={3}>
        <Column m="0 auto" isCollapsable={isCollapsable}>
          {(isCollapsed) => {
            return (
              <>
                <Flex alignItems="center">
                  {isCollapsable && (
                    <>
                      {isCollapsed ? (
                        <ChevronRightIcon boxSize={9} />
                      ) : (
                        <ChevronUpIcon boxSize={9} />
                      )}
                    </>
                  )}
                  <AppHeading>Une idée de forum ?</AppHeading>
                </Flex>

                {(!isCollapsed || !isCollapsable) && (
                  <>
                    {session ? (
                      <>
                        {/* <Text>
                              Pour ajouter un forum à <HostTag /> vous devez
                              d'abord créer une planète :
                            </Text> */}
                        <EntityAddButton
                          label="Ajoutez une planète"
                          orgType={EOrgType.NETWORK}
                          size="md"
                          mt={3}
                        />
                      </>
                    ) : (
                      <>
                        <Alert status="info" mt={2}>
                          <AlertIcon />

                          <Flex flexDirection="column">
                            <Text>
                              Pour ajouter un forum à <HostTag />, vous devez
                              d'abord vous connecter :
                            </Text>
                            <LoginButton
                              mt={3}
                              mr={3}
                              size={props.isMobile ? "xs" : undefined}
                              onClick={() => {
                                router.push("/login", "/login", {
                                  shallow: true
                                });
                              }}
                            >
                              Se connecter
                            </LoginButton>
                          </Flex>
                        </Alert>
                      </>
                    )}

                    <Flex alignItems="center" mt={3}>
                      <Link
                        href="/a_propos"
                        variant="underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        En savoir plus
                      </Link>
                      <ChevronRightIcon />
                    </Flex>
                  </>
                )}
              </>
            );
          }}
        </Column>
      </Flex>

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          header={<AppHeading>Carte</AppHeading>}
          orgs={
            selectedUserOrgs?.filter(
              (org) =>
                typeof org.orgLat === "number" &&
                typeof org.orgLng === "number" &&
                org.orgUrl !== "forum"
            ) || []
          }
          mapProps={{
            style: {
              position: "relative",
              height: "340px"
            }
          }}
          onClose={closeMapModal}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    store.dispatch(getOrgs.initiate(initialOrgsQueryParams));
    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {}
    };
  }
);

export default IndexPage;

{
  /* <Column {...columnProps}>
        <Text>
          Bienvenue sur l'outil de gestion en{" "}
          <Link variant="underline" onClick={openNetworksModal}>
            arborescence
          </Link>{" "}
          <HostTag />
        </Text>

        <Button
          canWrap
          colorScheme="teal"
          leftIcon={<ArrowForwardIcon />}
          my={5}
          onClick={() =>
            router.push(
              "/nom_de_votre_planete",
              "/nom_de_votre_planete",
              { shallow: true }
            )
          }
        >
          Exemple de page d'une organisation (association, groupe, pôle
          thématique, etc)
        </Button>

        <Text>Bonne découverte !</Text>
      </Column>

      <Column {...columnProps}>
        <Flex mb={3}>
          <Heading>Informations supplémentaires</Heading>
        </Flex>

        <Button
          canWrap
          colorScheme="teal"
          leftIcon={<ArrowForwardIcon />}
          mb={5}
          onClick={openAboutModal}
        >
          Vous êtes responsable de communication au sein d'une organisation
        </Button>

        <Button
          canWrap
          colorScheme="teal"
          isDisabled
          leftIcon={<ArrowForwardIcon />}
          mb={5}
          onClick={openAboutModal}
        >
          Vous êtes adhérent au sein d'une organisation
        </Button>
      </Column> */
}

{
  /* <Heading mb={3}>Et créez :</Heading>

            <Flex alignItems="center">
              <SmallAddIcon />
              <ChatIcon mr={1} />
              des discussions,
            </Flex>
            <Flex alignItems="center">
              <SmallAddIcon />
              <CalendarIcon mr={1} />
              des événements,
            </Flex>
            <Flex alignItems="center">
              <SmallAddIcon />
              <Icon as={FaTools} mr={1} />
              des projets,
            </Flex>
            <Flex alignItems="center">
              <SmallAddIcon />
              <Icon as={FaFile} mr={1} />
              des fichiers,
            </Flex>
            <Flex alignItems="center">
              <SmallAddIcon />
              <Icon as={FaTree} color="green" mr={1} /> des arbres.
            </Flex> */
}

{
  /*
                <Tooltip
                  label="Un compte vous permet de créer des planètes, et d'inviter d'autres personnes à collaborer."
                  isOpen={isTooltipOpen}
                >
                  <IconButton
                    aria-label="Qu'est ce qu'un Koala"
                    icon={<QuestionIcon />}
                    colorScheme="purple"
                    minWidth={0}
                    height="auto"
                    boxSize={props.isMobile ? 6 : 10}
                    onMouseEnter={
                      props.isMobile ? undefined : () => setIsTooltipOpen(true)
                    }
                    onMouseLeave={
                      props.isMobile ? undefined : () => setIsTooltipOpen(false)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTooltipOpen(!isTooltipOpen);
                    }}
                  />
                </Tooltip>
*/
}
