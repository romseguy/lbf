import {
  ArrowForwardIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HamburgerIcon
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
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
import { Button, Column, Heading } from "features/common";
import { Layout } from "features/layout";
import { AboutModal } from "features/modals/AboutModal";
import { MapModal } from "features/modals/MapModal";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { InputNode } from "features/treeChart/types";
import { EOrgType, EOrgVisibility } from "models/Org";
import { PageProps } from "./_app";

let cachedRefetchOrgs = false;

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

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

  const orgsQuery = useGetOrgsQuery({ populate: "orgs" });
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
  const [isListOpen, setIsListOpen] = useState(false);
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
      <Box
        css={css`
          & > div:first-of-type {
            margin-bottom: 16px;
          }
        `}
      >
        <Column>
          <Flex>
            <Heading>Présentations </Heading>
          </Flex>

          <Text my={3}>
            Cette application (optimisée mobile) a pour objectif de pérenniser
            et de mettre en valeur l'information et la communication au sein des
            organisations.
          </Text>

          <Button
            canWrap
            colorScheme="teal"
            leftIcon={<ArrowForwardIcon />}
            mb={5}
            py={2}
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
            py={2}
            onClick={openAboutModal}
          >
            Vous êtes adhérent au sein d'une organisation
          </Button>
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
                rightIcon={
                  isListOpen ? <ChevronUpIcon /> : <ChevronRightIcon />
                }
                mb={3}
                onClick={() => setIsListOpen(!isListOpen)}
              >
                Liste
              </Button>
            </>
          )}

          {isListOpen && (
            <Column m={undefined} bg={isDark ? "black" : "white"}>
              <OrgsList data={orgsQuery.data} isLoading={orgsQuery.isLoading} />
            </Column>
          )}
        </Column>
      </Box>

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
