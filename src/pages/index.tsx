import {
  CalendarIcon,
  ChatIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HamburgerIcon,
  SmallAddIcon
} from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Spinner,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegMap, FaTree, FaFile } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  Button,
  Column,
  EntityAddButton,
  Heading,
  LoginButton
} from "features/common";
import { Layout } from "features/layout";
import { AboutModal } from "features/modals/AboutModal";
import { MapModal } from "features/modals/MapModal";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { OrgsList } from "features/orgs/OrgsList";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { InputNode } from "features/treeChart/types";
import { selectUserEmail } from "store/userSlice";
import { EOrgType, EOrgVisibility, IOrg, OrgVisibilities } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
import { PageProps } from "main";

let cachedUserEmail: string | undefined;

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(0);

  //#region org query
  const orgsQuery = useGetOrgsQuery({ populate: "orgs createdBy" }) as AppQuery<
    IOrg[]
  >;
  const planets = orgsQuery.data?.filter((org) =>
    org ? org.orgType === EOrgType.NETWORK : true
  );
  useEffect(() => {
    if (!orgsQuery.isLoading) setIsLoading(false);
  }, [orgsQuery.isLoading]);
  //#endregion

  //#region subscription query
  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;
  useEffect(() => {
    if (router.asPath === "/?login") setIsLogin(isLogin + 1);
    subQuery.refetch();
  }, [router.asPath]);
  useEffect(() => {
    if (cachedUserEmail !== userEmail) {
      cachedUserEmail = userEmail;
      subQuery.refetch();
    }
  }, [userEmail]);
  //#endregion

  //#region modal state
  const {
    isOpen: isAboutModalOpen,
    onOpen: openAboutModal,
    onClose: closeAboutModal
  } = useDisclosure({ defaultIsOpen: false });
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
  const inputNodes: InputNode[] = useMemo(() => {
    return planets
      ? planets
          .filter(
            (org) =>
              org.orgType === EOrgType.NETWORK &&
              org.orgVisibility !== EOrgVisibility.PRIVATE &&
              org.orgUrl !== "forum"
          )
          .map((org) => {
            return {
              name: org.orgName,
              children: org.orgs
                .filter(
                  ({ orgVisibility }) =>
                    orgVisibility !== EOrgVisibility.PRIVATE
                )
                .map(({ orgName }) => ({ name: orgName }))
            };
          })
      : [];
  }, [planets]);
  //#endregion

  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    mb: 3
  };

  return (
    <Layout {...props} isLogin={isLogin} pageTitle="Accueil">
      <Column {...columnProps}>
        <Heading mb={3}>Premiers pas</Heading>
        {!props.session && (
          <Flex>
            <LoginButton
              mb={3}
              onClick={() => {
                setIsLogin(isLogin + 1);
              }}
            >
              Connectez-vous à votre koala
            </LoginButton>
          </Flex>
        )}
        <Flex>
          <EntityAddButton orgType={EOrgType.NETWORK} size="md" mb={3} />
        </Flex>
        <Flex alignItems="center">
          <SmallAddIcon />
          <ChatIcon mr={1} />
          Ajoutez des discussions à votre planète,
        </Flex>
        <Flex alignItems="center">
          <SmallAddIcon />
          <CalendarIcon mr={1} />
          des événements,
        </Flex>
        <Flex alignItems="center">
          <SmallAddIcon />
          <Icon as={FaFile} mr={1} />
          des fichiers,
        </Flex>
        <Flex alignItems="center">
          <SmallAddIcon />
          <Icon as={FaTree} color="green" mr={1} /> des arbres, et accédez de
          nouveau à ces fonctionnalités.
        </Flex>
      </Column>

      <Column {...columnProps}>
        <Flex alignItems="center">
          <Heading mb={3}>L'univers des koalas</Heading>
          {/* <HostTag ml={1} /> */}
        </Flex>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              leftIcon={<IoIosGitNetwork />}
              rightIcon={
                isNetworksModalOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
              }
              mb={5}
              onClick={openNetworksModal}
            >
              Organigramme
            </Button>

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
              mb={3}
              onClick={() => setIsListOpen(!isListOpen)}
            >
              Liste
            </Button>

            {isListOpen && (
              <Column bg={isDark ? "black" : "white"}>
                <OrgsList query={orgsQuery} subQuery={subQuery} />
              </Column>
            )}
          </>
        )}
      </Column>

      {isAboutModalOpen && (
        <AboutModal
          {...props}
          isOpen={isAboutModalOpen}
          onClose={closeAboutModal}
        />
      )}

      {isNetworksModalOpen && (
        <TreeChartModal
          header={<Heading mb={3}>Organigramme</Heading>}
          inputNodes={inputNodes}
          isMobile={props.isMobile}
          isOpen={isNetworksModalOpen}
          onClose={closeNetworksModal}
        />
      )}

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
