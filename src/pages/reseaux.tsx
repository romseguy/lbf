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
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Detector } from "react-detect-offline";
import { FaRegMap } from "react-icons/fa";
import { PageContainer } from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { OrgsList } from "features/orgs/OrgsList";
import { treeChart } from "features/treeChart/treeChart";
import { InputNode, RenderChart } from "features/treeChart/types";
import { hasItems } from "utils/array";
import { normalize } from "utils/string";
import { Visibility } from "models/Org";
import { PageProps } from "./_app";
import { NetworksModal } from "features/modals/NetworksModal";

let renderChart: RenderChart | undefined;

const NetworksPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
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
  const [elementLocked, setElementLocked] = useState<HTMLElement | undefined>();

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

  // useEffect(() => {
  //   if (!inputNodes) return;

  //   const treeChartContainer = document.getElementById("treeC");

  //   if (!treeChartContainer) return;

  //   const renderChartWithInputNodes = (inputNodes: InputNode[]) => {
  //     const width =
  //       (document.getElementById("pageContainer") || new HTMLElement())
  //         .clientWidth - 30;

  //     let treeChartRoot = document.getElementById("tree") as HTMLDivElement;

  //     treeChartContainer.removeChild(treeChartRoot);
  //     treeChartRoot = document.createElement("div");
  //     treeChartRoot.setAttribute("id", "tree");
  //     treeChartContainer.appendChild(treeChartRoot);

  //     renderChart = treeChart(treeChartRoot, {
  //       id: "treeSvg",
  //       aspectRatio: 0.75,
  //       isSorted: true,
  //       widthBetweenNodesCoeff: 0.5,
  //       heightBetweenNodesCoeff: 2,
  //       style: { background: "white", width },
  //       //tooltipOptions: { offset: { left: 30, top: 10 }, indentationSize: 2 },
  //       initialZoom: 0.5,
  //       onClickText: (node) => {
  //         const url = "/" + normalize(node.name);
  //         router.push(url, url, { shallow: true });
  //       },
  //       onZoom: () => {
  //         // if (!elementLocked) {
  //         //   disableBodyScroll(treeChartContainer);
  //         //   setElementLocked(treeChartContainer);
  //         //   setTimeout(() => {
  //         //     enableBodyScroll(treeChartContainer);
  //         //     setElementLocked(undefined);
  //         //   }, 1000);
  //         // }
  //       }
  //     });

  //     renderChart({
  //       name: process.env.NEXT_PUBLIC_SHORT_URL,
  //       children: inputNodes
  //     });
  //   };

  //   const run = () => {
  //     renderChartWithInputNodes(inputNodes);
  //   };

  //   window.removeEventListener("resize", run);
  //   window.addEventListener("resize", run);
  //   run();
  // }, [inputNodes]);

  return (
    <Layout
      pageTitle="Réseaux"
      onTouchStart={() => {
        if (elementLocked) {
          enableBodyScroll(elementLocked);
          setElementLocked(undefined);
        }
      }}
      onWheel={() => {
        if (elementLocked) {
          enableBodyScroll(elementLocked);
          setElementLocked(undefined);
        }
      }}
      {...props}
    >
      <PageContainer id="pageContainer">
        <Heading className="rainbow-text" fontFamily="DancingScript" mb={2}>
          Réseaux
        </Heading>

        {orgsQuery.isLoading ? (
          <Spinner />
        ) : (
          <Button onClick={() => openNetworksModal()}>
            Voir l'arborescence des réseaux
          </Button>
        )}

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
