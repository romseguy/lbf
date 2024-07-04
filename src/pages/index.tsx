import { Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { AppHeading } from "features/common";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType } from "models/Org";
import { LoginForm } from "features/forms/LoginForm";
import { OrgsList } from "features/orgs/OrgsList";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { getError } from "utils/query";
import { ErrorPage } from "./_error";

const IndexPage = ({ ...props }: PageProps) => {
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();

  const initialOrgsQueryParams = {
    orgType: EOrgType.NETWORK,
    populate: "orgs orgTopics.topicMessages createdBy"
  };
  const [orgsQueryParams, setOrgsQueryParams] = useState(
    initialOrgsQueryParams
  );
  const orgsQuery = useGetOrgsQuery(orgsQueryParams, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      orgs: (data || []).filter((org) => true)
    })
  });

  //@ts-ignore
  if (getError(orgsQuery)) return <ErrorPage query={orgsQuery} {...props} />;

  return (
    <Layout
      {...props}
      pageTitle={`Bienvenue ${session ? session.user.userName : ""} !`}
    >
      {session ? (
        <>
          <AppHeading mb={5}>Liste des ateliers LEO</AppHeading>
          {orgsQuery.isLoading ? (
            <Spinner />
          ) : (
            <OrgsList data={orgsQuery.orgs} />
          )}
        </>
      ) : (
        <LoginForm
          {...props}
          title="Veuillez vous identifier pour accéder aux ateliers"
        />
      )}
    </Layout>
  );
};

export default IndexPage;

{
  /*
// const IndexPage = (props: PageProps) => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const { colorMode } = useColorMode();
//   const isDark = colorMode === "dark";

//   const columnProps: ColumnProps = {
//     bg: isDark ? "gray.700" : "lightblue",
//     p: 5
//   };
//   const isOffline = useSelector(selectIsOffline);

//   const eventsQuery = useGetEventsQuery();

//   const events = eventsQuery.data?.filter((event) => {
//     if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
//     if (event.eventVisibility !== EEventVisibility.PUBLIC) return false;
//     if (
//       event.eventOrgs.find(({ orgVisibility, createdBy }) => {
//         return (
//           orgVisibility === EOrgVisibility.PRIVATE &&
//           createdBy !== session?.user.userId
//         );
//       })
//     )
//       return false;
//     return event.isApproved;
//   });

//   const {
//     isOpen: isMapModalOpen,
//     onOpen: openMapModal,
//     onClose: closeMapModal
//   } = useDisclosure({ defaultIsOpen: false });

//   const [title = "Ateliers LEO", setTitle] = useState<string | undefined>();

//   return (
//     <Layout {...props} pageTitle={title}>
//       <Tooltip
//         label={
//           !eventsQuery.data || !eventsQuery.data.length
//             ? "Aucun événements"
//             : isOffline
//             ? "Vous devez être connecté à internet pour afficher la carte des événements"
//             : ""
//         }
//         hasArrow
//         placement="left"
//       >
//         <span>
//           <Button
//             colorScheme="teal"
//             isDisabled={isOffline || !events || !events.length}
//             leftIcon={<FaRegMap />}
//             onClick={openMapModal}
//             mb={5}
//           >
//             Carte des événements
//           </Button>
//         </span>
//       </Tooltip>

//       <Column {...columnProps} mb={5}>
//         <AppHeading>Liste des événements</AppHeading>
//       </Column>

//       <Column {...columnProps}>
//         {eventsQuery.isLoading ? (
//           <Text mb={5}>Chargement des événements publics...</Text>
//         ) : (
//           events && <EventsList events={events} setTitle={setTitle} />
//         )}
//       </Column>

//       {isMapModalOpen && (
//         <MapModal
//           isOpen={isMapModalOpen}
//           events={
//             events?.filter((event) => {
//               return (
//                 typeof event.eventLat === "number" &&
//                 typeof event.eventLng === "number" &&
//                 event.eventVisibility === EEventVisibility.PUBLIC
//               );
//             }) || []
//           }
//           onClose={closeMapModal}
//         />
//       )}
//     </Layout>
//   );
// };
 */
}

{
  /*

  const isCollapsable = true;
  const initialOrgsQueryParams = {
    orgType: EOrgType.NETWORK,
    populate: "orgs orgTopics.topicMessages createdBy"
  };

  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
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

  //#region local state
  const [isListOpen, setIsListOpen] = useState(true);
  const sMap: Partial<Record<EOrgVisibility, string>> = {
    [EOrgVisibility.FRONT]: "Accueil",
    [EOrgVisibility.PUBLIC]: "Tous les forums"
  };
  const [pageTitle, setPageTitle] = useState(
    session ? "Votre forum" : sMap[EOrgVisibility.FRONT]
  );
  const [selectedOrgVisibility, setSelectedOrgVisibility] = useState(
    EOrgVisibility.FRONT
  );
  const [selectedUserId, setSelectedUserId] = useState(
    session ? session.user.userId : ""
  );
  useEffect(() => {
    if (selectedUserId) {
      if (session && selectedUserId === session.user.userId)
        setPageTitle("Votre forum");
    } else setPageTitle(sMap[selectedOrgVisibility]);
  }, [selectedOrgVisibility, selectedUserId]);

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
  //#endregion

  //#region modal
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  //#endregion

  return (
    <Layout {...props} mainContainer={false} pageTitle={pageTitle}>
      <Column
        bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
        //m={props.isMobile ? undefined : "0 auto"}
        m={props.isMobile ? undefined : 3}
        //maxWidth="4xl"
        p={props.isMobile ? 2 : 3}
      >
         <Flex alignItems="center">
          <AppHeading mb={3}>
            Forum {process.env.NEXT_PUBLIC_SHORT_URL}
          </AppHeading>
        </Flex> 

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
          {session && <option value={session.user.userId}>Votre forum</option>}

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
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<HamburgerIcon />}
              rightIcon={isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />}
              mb={isListOpen ? 3 : 0}
              onClick={() => setIsListOpen(!isListOpen)}
            >
              Liste
            </Button> 

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

            <Button
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
            </Button>
          </>
        ) : (
          <Flex>
            <EntityAddButton
              label="Ajoutez une atelier"
              orgType={EOrgType.NETWORK}
              size={props.isMobile ? "xs" : "md"}
              mb={3}
            />
          </Flex>
        )}
      </Column>

      <Flex mt={6} mb={5}>
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
                  <AppHeading>Une idée de forum ?</AppHeading>
                </Flex>

                {(!isCollapsed || !isCollapsable) && (
                  <>
                    {session ? (
                      <>
                         <Text>
                              Pour ajouter un forum à <HostTag /> vous devez
                              d'abord créer une atelier :
                            </Text> 
                        <EntityAddButton
                          label="Ajoutez une atelier"
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
}
  */
}

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
                  label="Un compte vous permet de créer des ateliers, et d'inviter d'autres personnes à collaborer."
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

{
  /*export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    store.dispatch(getOrgs.initiate(initialOrgsQueryParams));
    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {}
    };
  }
);*/
}
