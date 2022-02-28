import {
  ArrowForwardIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HamburgerIcon
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  List,
  ListItem,
  Spinner,
  Text,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { Button, Column, Heading, HostTag } from "features/common";
import { Layout } from "features/layout";
import { AboutModal } from "features/modals/AboutModal";
import { MapModal } from "features/modals/MapModal";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { InputNode } from "features/treeChart/types";
import { selectUserEmail } from "features/users/userSlice";
import { EOrgType, EOrgVisibility, IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
import { PageProps } from "./_app";
import { useRouter } from "next/router";

let cachedRefetchOrgs = false;
let cachedUserEmail: string | undefined;

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail);

  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;
  useEffect(() => {
    subQuery.refetch();
  }, [router.asPath]);
  useEffect(() => {
    if (cachedUserEmail !== userEmail) {
      cachedUserEmail = userEmail;
      subQuery.refetch();
    }
  }, [userEmail]);

  //#region local state
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

  const orgsQuery = useGetOrgsQuery({ populate: "orgs" }) as AppQuery<IOrg[]>;
  const inputNodes: InputNode[] = useMemo(() => {
    return orgsQuery.data
      ? orgsQuery.data
          .filter(
            (org) =>
              org.orgType === EOrgType.NETWORK &&
              org.orgVisibility !== EOrgVisibility.PRIVATE
          )
          .map((org) => {
            return {
              name: org.orgName,
              children: org.orgs.map(({ orgName }) => ({ name: orgName }))
            };
          })
      : [];
  }, [orgsQuery.data]);
  const [isListOpen, setIsListOpen] = useState(true);
  //#endregion

  //#region cross refetch
  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
    }
  }, [refetchOrgs]);
  //#endregion

  return (
    <Layout {...props} pageTitle="Accueil">
      <Column mb={3}>
        <Text>
          Bienvenue sur l'arborescence <HostTag />
        </Text>

        <Button
          canWrap
          colorScheme="teal"
          leftIcon={<ArrowForwardIcon />}
          my={5}
          onClick={() =>
            router.push(
              "/nom_de_votre_organisation",
              "/nom_de_votre_organisation",
              { shallow: true }
            )
          }
        >
          Exemple de page d'une organisation (association, groupe, pôle
          thématique, etc)
        </Button>

        <Text>Bonne découverte !</Text>
      </Column>

      <Column mb={3}>
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

        {/* <Button
          canWrap
          colorScheme="teal"
          isDisabled
          leftIcon={<ArrowForwardIcon />}
          mb={5}
          onClick={openAboutModal}
        >
          Vous êtes adhérent au sein d'une organisation
        </Button> */}
      </Column>

      <Column>
        <Flex>
          <Heading mb={3}>Naviguer dans les organisations</Heading>
        </Flex>

        {orgsQuery.isLoading ? (
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
              rightIcon={isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />}
              mb={3}
              onClick={() => setIsListOpen(!isListOpen)}
            >
              Liste
            </Button>

            {isListOpen && (
              <Column m={undefined} bg={isDark ? "black" : "white"}>
                <OrgsList query={orgsQuery} subQuery={subQuery} />
              </Column>
            )}
          </>
        )}
      </Column>

      {isAboutModalOpen && (
        <AboutModal
          isMobile={props.isMobile}
          isOpen={isAboutModalOpen}
          onClose={closeAboutModal}
        />
      )}

      {isNetworksModalOpen && (
        <TreeChartModal
          inputNodes={inputNodes}
          isMobile={props.isMobile}
          isOpen={isNetworksModalOpen}
          //header="Carte des réseaux"
          onClose={closeNetworksModal}
        />
      )}

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          header="Carte des réseaux"
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
