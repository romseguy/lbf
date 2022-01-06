import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Detector } from "react-detect-offline";
import { FaRegMap } from "react-icons/fa";
import { PageContainer } from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { OrgsList } from "features/orgs/OrgsList";
import { treeChart } from "features/treeChart/treeChart";
import { RenderChart } from "features/treeChart/types";
import { hasItems } from "utils/array";
import { normalize } from "utils/string";
import { Visibility } from "models/Org";
import { isServer } from "utils/isServer";

let renderChart: RenderChart | undefined;
let treeChartRoot: HTMLElement | null;

const NetworksPage = (props: any) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  const orgsQuery = useGetOrgsQuery({ populate: "orgs" });
  const orgsNodes = orgsQuery.data
    ?.filter(
      (org) => hasItems(org.orgs) && org.orgVisibility !== Visibility.PRIVATE
    )
    .map((org) => ({
      name: org.orgName,
      children: org.orgs?.map(({ orgName }) => ({ name: orgName }))
    }));

  useEffect(() => {
    if (!orgsNodes) return;

    const width =
      (document.getElementById("pageContainer") || new HTMLElement())
        .clientWidth - 30;

    const c = document.getElementById("treeC");
    treeChartRoot = document.getElementById("tree");

    if (treeChartRoot) {
      c?.removeChild(treeChartRoot);
    }

    treeChartRoot = document.createElement("div");
    treeChartRoot.setAttribute("id", "tree");
    c?.appendChild(treeChartRoot);

    renderChart = treeChart(treeChartRoot, {
      id: "treeExample",
      aspectRatio: 0.5,
      isSorted: true,
      widthBetweenNodesCoeff: 0.5,
      heightBetweenNodesCoeff: 2,
      style: { background: "white", width },
      //tooltipOptions: { offset: { left: 30, top: 10 }, indentationSize: 2 },
      initialZoom: 0.5,
      onClickText: (node) => {
        const url = "/" + normalize(node.name);
        router.push(url, url, { shallow: true });
      }
    });

    renderChart({
      name: process.env.NEXT_PUBLIC_SHORT_URL,
      children: orgsNodes
    });
  }, [orgsNodes]);

  return (
    <Layout pageTitle="Réseaux" {...props}>
      <PageContainer id="pageContainer">
        <Heading className="rainbow-text" fontFamily="DancingScript" mb={2}>
          Réseaux
        </Heading>

        <Box id="treeC" margin="12px auto">
          {orgsQuery.isLoading && <Spinner mb={5} />}
          <div id="tree" />
        </Box>

        <Flex alignItems="center">
          <Box flexGrow={1} mt={orgsQuery.isLoading ? 3 : undefined}>
            <Heading className="rainbow-text" fontFamily="DancingScript">
              Organisations
            </Heading>
          </Box>

          {!orgsQuery.isLoading && (
            <Box mt={3}>
              <Detector
                polling={{
                  enabled: true,
                  interval: 1000,
                  timeout: 5000,
                  url: `${process.env.NEXT_PUBLIC_API}/check`
                }}
                render={({ online }) => (
                  <Tooltip
                    label={
                      !orgsQuery.data || !orgsQuery.data.length
                        ? "Aucune organisations"
                        : !online
                        ? "Vous devez être connecté à internet pour afficher la carte"
                        : ""
                    }
                    placement="right"
                    hasArrow
                  >
                    <span>
                      <Button
                        colorScheme="teal"
                        isDisabled={
                          !online || !orgsQuery.data || !orgsQuery.data.length
                        }
                        leftIcon={<FaRegMap />}
                        onClick={openMapModal}
                        mb={3}
                      >
                        Carte
                      </Button>
                    </span>
                  </Tooltip>
                )}
              />
            </Box>
          )}
        </Flex>

        <OrgsList orgsQuery={orgsQuery} />

        {isMapModalOpen && (
          <MapModal
            isOpen={isMapModalOpen}
            header="Carte des réseaux"
            orgs={
              orgsQuery.data?.filter(
                (org) =>
                  typeof org.orgLat === "number" &&
                  typeof org.orgLng === "number" &&
                  org.orgName !== "aucourant"
              ) || []
            }
            onClose={closeMapModal}
          />
        )}
      </PageContainer>
    </Layout>
  );
};

export default NetworksPage;
