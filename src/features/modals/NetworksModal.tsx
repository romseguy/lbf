import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { treeChart } from "features/treeChart/treeChart";
import { normalize } from "utils/string";
import { InputNode } from "features/treeChart/types";
import theme from "theme/theme";

export const NetworksModal = ({
  inputNodes,
  header,
  ...props
}: {
  inputNodes: InputNode[];
  isOpen: boolean;
  header?: React.ReactNode | React.ReactNodeArray;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  useEffect(() => {
    const run = () => {
      const treeChartContainer = document.getElementById("treeC");
      if (!treeChartContainer) return;
      let treeChartRoot = document.getElementById("tree") as HTMLDivElement;

      treeChartContainer.removeChild(treeChartRoot);
      treeChartRoot = document.createElement("div");
      treeChartRoot.setAttribute("id", "tree");
      treeChartContainer.appendChild(treeChartRoot);

      const tree = {
        name: process.env.NEXT_PUBLIC_SHORT_URL,
        children: inputNodes
      };
      const renderChart = treeChart(treeChartRoot, tree, {
        id: "treeSvg",
        initialZoom: 1,
        isFullscreen: true,
        isSorted: true,
        heightBetweenNodesCoeff: 1,
        widthBetweenNodesCoeff: 1,
        aspectRatio: 1,
        margin: {
          top: 62
        },
        padding: {},
        style: {
          background: isDark ? theme.colors.gray["800"] : "white",
          link: { stroke: isDark ? "#fff" : "#000" },
          text: { colors: { default: isDark ? "white" : "black" } }
        },
        onClickText: (node) => {
          const url = "/" + normalize(node.name);
          router.push(url, url, { shallow: true });
        }
      });

      renderChart(undefined);
    };

    // window.removeEventListener("resize", run);
    // window.addEventListener("resize", run);
    setTimeout(() => run(), 1000);
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose && props.onClose();
      }}
      size="full"
    >
      <ModalOverlay>
        <ModalContent my={0} minHeight="100vh">
          <ModalHeader>Arborescence des réseaux</ModalHeader>
          <ModalCloseButton />
          <ModalBody id="treeC" p={0} display="flex" flexDirection="column">
            <div id="tree" />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
