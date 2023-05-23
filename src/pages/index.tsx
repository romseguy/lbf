import {
  CalendarIcon,
  ChatIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HamburgerIcon,
  QuestionIcon,
  SmallAddIcon
} from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  IconButton,
  Spinner,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { FaRegMap, FaTree, FaFile, FaTools } from "react-icons/fa";
import { useSelector } from "react-redux";
import { orgApi, useGetOrgsQuery } from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import {
  Button,
  Column,
  EntityAddButton,
  Heading,
  Link,
  LoginButton
} from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, IOrg, orgTypeFull } from "models/Org";
import { ISubscription } from "models/Subscription";
import { selectUserEmail } from "store/userSlice";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";
import { GetServerSidePropsContext } from "next";
import { AppStore, wrapper } from "store";

let cachedUserEmail: string | undefined;
const orgsQueryParams = {
  orgType: EOrgType.NETWORK,
  populate: "orgs createdBy"
};

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const userEmail = useSelector(selectUserEmail) || session?.user.email;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const ref = useOnclickOutside(() => {
    if (isTooltipOpen) setIsTooltipOpen(false);
  });

  //#region modal
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  //#endregion

  //#region orgs
  const orgsQuery = useGetOrgsQuery(orgsQueryParams) as AppQuery<IOrg[]>;
  useEffect(() => {
    if (!orgsQuery.isLoading) setIsLoading(false);
  }, [orgsQuery.isLoading]);
  //#endregion

  //#region subscription
  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;
  useEffect(() => {
    if (!cachedUserEmail) cachedUserEmail = userEmail;
    else if (cachedUserEmail !== userEmail) {
      cachedUserEmail = userEmail;
      subQuery.refetch();
    }
  }, [userEmail]);
  //#endregion

  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto"
  };

  return (
    <Layout {...props} pageTitle="Accueil">
      <Column
        {...columnProps}
        cursor="pointer"
        _hover={{ backgroundColor: isDark ? "gray.500" : "blue.50" }}
        mb={3}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Flex alignItems="center" mb={2}>
          <Heading>Premiers pas</Heading>
          {isCollapsed ? (
            <ChevronRightIcon boxSize={9} mt={2} />
          ) : (
            <ChevronUpIcon boxSize={9} mt={2} />
          )}
        </Flex>

        {!isCollapsed && (
          <>
            {!session && !isSessionLoading && (
              <Flex ref={ref}>
                <LoginButton
                  mb={3}
                  size={props.isMobile ? "xs" : undefined}
                  onClick={() => {
                    router.push("/login", "/login", { shallow: true });
                  }}
                >
                  Connectez-vous à votre compte Koala
                </LoginButton>
                <Tooltip
                  label="Un Koala vous permet de créer des planètes, afin de partager des informations et inviter d'autres Koalas à discuter et à collaborer."
                  isOpen={isTooltipOpen}
                >
                  <IconButton
                    aria-label="Qu'est ce qu'un Koala"
                    background="transparent"
                    _hover={{ background: "transparent" }}
                    minWidth={0}
                    height="auto"
                    icon={<QuestionIcon />}
                    boxSize={props.isMobile ? 6 : 10}
                    color="purple"
                    onMouseEnter={
                      props.isMobile ? undefined : () => setIsTooltipOpen(true)
                    }
                    onMouseLeave={
                      props.isMobile ? undefined : () => setIsTooltipOpen(false)
                    }
                    onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                  />
                </Tooltip>
              </Flex>
            )}

            <Flex>
              <EntityAddButton
                label="Ajoutez une planète"
                orgType={EOrgType.NETWORK}
                size={props.isMobile ? "xs" : "md"}
                mb={3}
              />
            </Flex>

            <Heading mb={3}>Et créez :</Heading>

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
            </Flex>

            <Flex>
              <Link
                href="a_propos"
                variant="underline"
                mt={3}
                onClick={(e) => e.stopPropagation()}
              >
                En savoir plus
              </Link>
            </Flex>
          </>
        )}
      </Column>

      <Column {...columnProps}>
        <Flex alignItems="center">
          <Heading mb={3}>
            L'univers {process.env.NEXT_PUBLIC_SHORT_URL}
          </Heading>
          {/* <HostTag ml={1} /> */}
        </Flex>

        {isLoading ? (
          <Spinner />
        ) : hasItems(orgsQuery.data) ? (
          <>
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<FaRegMap />}
              rightIcon={
                isMapModalOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
              }
              onClick={openMapModal}
              mb={5}
            >
              Carte
            </Button>

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
              <Column bg={isDark ? "gray.700" : "white"}>
                <OrgsList
                  keys={
                    props.isMobile
                      ? (orgType) => [
                          { key: "subscription", label: "" },
                          {
                            key: "orgName",
                            label: `Nom de ${orgTypeFull(orgType)}`
                          }
                        ]
                      : (orgType) => [
                          { key: "subscription", label: "" },
                          {
                            key: "orgName",
                            label: `Nom de ${orgTypeFull(orgType)}`
                          },
                          { key: "createdBy", label: "Créé par" }
                        ]
                  }
                  isMobile={props.isMobile}
                  query={orgsQuery}
                  subQuery={subQuery}
                />
              </Column>
            )}
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

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          header={<Heading>Carte</Heading>}
          orgs={
            orgsQuery.data?.filter(
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
    store.dispatch(orgApi.endpoints.getOrgs.initiate(orgsQueryParams));
    await Promise.all(store.dispatch(orgApi.util.getRunningQueriesThunk()));

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
