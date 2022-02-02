import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import { useSelector } from "react-redux";
import { PageContainer } from "features/common";
import { Layout } from "features/layout";
import { AboutModal } from "features/modals/AboutModal";
import { MapModal } from "features/modals/MapModal";
import { NetworksModal } from "features/modals/NetworksModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { InputNode } from "features/treeChart/types";
import { Visibility } from "models/Org";
import { hasItems } from "utils/array";
import { PageProps } from "./_app";

let cachedRefetchOrgs = false;

const IndexPage = (props: PageProps) => {
  const [isListOpen, setIsListOpen] = useState(false);
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
  const inputNodes: InputNode[] = useMemo(
    () =>
      orgsQuery.data
        ? orgsQuery.data
            .filter(
              (org) =>
                hasItems(org.orgs) && org.orgVisibility !== Visibility.PRIVATE
            )
            .map((org) => ({
              name: org.orgName,
              children: org.orgs?.map(({ orgName }) => ({ name: orgName }))
            }))
        : [],
    [orgsQuery.data]
  );
  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
    }
  }, [refetchOrgs]);

  return (
    <Layout {...props} pageTitle="Accueil">
      <PageContainer>
        <Flex>
          <Heading className="rainbow-text" fontFamily="DancingScript" mb={5}>
            Bienvenue
          </Heading>
        </Flex>

        <Button
          alignSelf="flex-start"
          colorScheme="teal"
          leftIcon={<QuestionIcon />}
          mb={5}
          onClick={openAboutModal}
        >
          À propos
        </Button>

        <Flex>
          <Heading className="rainbow-text" fontFamily="DancingScript" mb={5}>
            Réseaux
          </Heading>
        </Flex>

        {orgsQuery.isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              //isLoading={orgsQuery.isLoading}
              leftIcon={<IoIosGitNetwork />}
              mb={5}
              onClick={openNetworksModal}
            >
              Arborescence
            </Button>

            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              //isLoading={orgsQuery.isLoading}
              leftIcon={<FaRegMap />}
              onClick={openMapModal}
              mb={5}
            >
              Carte
            </Button>

            <Button
              alignSelf="flex-start"
              colorScheme="teal"
              //isLoading={orgsQuery.isLoading}
              leftIcon={<HamburgerIcon />}
              mb={5}
              onClick={() => setIsListOpen(!isListOpen)}
            >
              Liste
            </Button>
          </>
        )}

        {isListOpen && (
          <OrgsList data={orgsQuery.data} isLoading={orgsQuery.isLoading} />
        )}

        {isAboutModalOpen && (
          <AboutModal
            isMobile={props.isMobile}
            isOpen={isAboutModalOpen}
            onClose={closeAboutModal}
          />
        )}

        {isNetworksModalOpen && (
          <NetworksModal
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
            onClose={closeMapModal}
          />
        )}
      </PageContainer>
    </Layout>
  );
};

export default IndexPage;
