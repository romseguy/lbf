import {
  Flex,
  Select,
  Spinner,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getRunningQueriesThunk } from "features/api";
import { getOrgs, useGetOrgsQuery } from "features/api/orgsApi";
import { Column, EntityAddButton, AppHeading } from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { EOrderKey, OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, EOrgVisibility } from "models/Org";
import { hasItems } from "utils/array";
import { wrapper } from "store";
import { useGetUsersQuery } from "features/api/usersApi";
import { getRefId } from "models/Entity";

const initialOrgsQueryParams = {
  orgType: EOrgType.NETWORK,
  //populate: "orgs orgTopics.topicMessages createdBy"
  populate: "orgTopics.topicMessages"
};

const IndexPage = (props: PageProps) => {
  const [orgsQueryParams, setOrgsQueryParams] = useState(
    initialOrgsQueryParams
  );
  const orgsQuery = useGetOrgsQuery(orgsQueryParams, {
    selectFromResult: ({ data, ...query }) => {
      return {
        ...query,
        data: data?.filter((org) => org.orgVisibility === EOrgVisibility.FRONT)
      };
    }
  });

  return (
    <Layout {...props} mainContainer={true} pageTitle="Accueil">
      {orgsQuery.isLoading && <Spinner />}
      {!orgsQuery.isLoading && !!orgsQuery.data?.length && (
        <OrgsList
          data={orgsQuery.data}
          keys={(orgType) => [
            {
              key: EOrderKey.orgName,
              label: `Nom du forum`
            },
            {
              key: EOrderKey.latestActivity,
              label: "Dernier message"
            }
          ]}
        />
      )}
      {!orgsQuery.isLoading && !orgsQuery.data?.length && <>Aucun forums</>}

      <Flex justifyContent="center">
        <EntityAddButton
          label="Ajoutez un forum"
          orgType={EOrgType.NETWORK}
          size={props.isMobile ? "xs" : "md"}
          mt={5}
        />
      </Flex>
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
              "/nom_de_votre_forum",
              "/nom_de_votre_forum",
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

const IndexPageOld = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedUserId, setSelectedUserId] = useState(
    session ? session.user.userId : ""
  );

  //#region orgs
  const sMap: Partial<Record<EOrgVisibility, string>> = {
    [EOrgVisibility.FRONT]: "Accueil",
    [EOrgVisibility.PUBLIC]: "Tous les forums"
  };
  const [pageTitle, setPageTitle] = useState(sMap[EOrgVisibility.FRONT]);
  const [selectedOrgVisibility, setSelectedOrgVisibility] = useState(
    EOrgVisibility.FRONT
  );
  useEffect(() => {
    if (selectedUserId) {
      if (session && selectedUserId === session.user.userId)
        setPageTitle("Mes forums");
      else
        setPageTitle(
          "Forums de " +
            usersQuery.data?.find(({ _id }) => _id === selectedUserId)?.userName
        );
    } else setPageTitle(sMap[selectedOrgVisibility]);
  }, [selectedOrgVisibility, selectedUserId]);
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
  let keys = [
    {
      key: EOrderKey.orgName,
      label: `Nom`
    },
    {
      key: EOrderKey.latestActivity,
      label: "Dernier message"
    }
  ];
  if (!selectedUserId && selectedOrgVisibility === EOrgVisibility.PUBLIC)
    keys.push({ key: EOrderKey.createdBy, label: "Créé par" });
  else keys.splice(2, 1);

  //#region users
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

  //#region misc
  const [isListOpen, setIsListOpen] = useState(true);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  return (
    <Layout {...props} mainContainer={false} pageTitle={pageTitle}>
      <Column
        bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
        //m={props.isMobile ? undefined : "0 auto"}
        m={props.isMobile ? undefined : 3}
        //maxWidth="4xl"
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
            const selectedOption = e.target.value;
            console.log("🚀 ~ IndexPage ~ selectedOption:", selectedOption);
            if (!selectedOption) {
              setSelectedUserId("");
              setSelectedOrgVisibility(EOrgVisibility.FRONT);
              return;
            }

            if (selectedOption in EOrgVisibility) {
              const value = selectedOption as EOrgVisibility;
              setSelectedUserId("");
              setSelectedOrgVisibility(value);
              return;
            }

            setSelectedUserId(selectedOption);
          }}
        >
          <option value={EOrgVisibility.FRONT}>
            {sMap[EOrgVisibility.FRONT]}
          </option>
          <option value={EOrgVisibility.PUBLIC}>
            {sMap[EOrgVisibility.PUBLIC]}
          </option>
          {session && <option value={session.user.userId}>Mes forums</option>}

          {usersQuery.data?.map(({ _id, userName }) => {
            if (_id === session?.user.userId) return null;

            return (
              <option key={_id} value={_id}>
                {`Forum de ${userName}`}
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
              <Column bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"}>
                {selectedUserOrgs && (
                  <OrgsList
                    data={selectedUserOrgs}
                    keys={(orgType) => keys}
                    //subQuery={subQuery}
                  />
                )}
              </Column>
            )}

            {/*<Button
              colorScheme="teal"
              alignSelf="flex-start"
              leftIcon={<FaRegMap />}
              rightIcon={
                isMapModalOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
              }
              onClick={openMapModal}
              mt={3}
            >
              Carte
            </Button>*/}
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

      {/* Une idée de forum ? */}
      {/* <Flex mt={6} mb={5}>
        <Column
          bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
          m="0 auto"
          isCollapsable={isCollapsable}
        >
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
                  <AppHeading>
                    <Link href="/a_propos" variant="underline">
                      En savoir +
                    </Link>
                  </AppHeading>
                </Flex>

                {
                  (!isCollapsed || !isCollapsable)
                  false && (
                    <>
                      {session ? (
                        <>
                          <Text>
                              Pour ajouter un forum à <HostTag /> vous devez
                              d'abord créer une planète :
                            </Text>
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
                  )
                }
              </>
            );
          }}
        </Column>
      </Flex> */}

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
