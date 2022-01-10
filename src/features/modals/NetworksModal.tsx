import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorMode
} from "@chakra-ui/react";
import AbortController from "abort-controller";
//import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { treeChart } from "features/treeChart/treeChart";
import { InputNode } from "features/treeChart/types";
import theme from "theme/theme";
import { normalize } from "utils/string";

const controller = new AbortController();
const signal = controller.signal;
let treeChartContainer: HTMLElement | null | undefined;

export const NetworksModal = ({
  inputNodes,
  isMobile,
  header,
  ...props
}: {
  inputNodes: InputNode[];
  isMobile: boolean;
  isOpen: boolean;
  header?: React.ReactNode | React.ReactNodeArray;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  useEffect(() => {
    const renderChart = () => {
      treeChartContainer = document.getElementById("treeC");

      if (!treeChartContainer) return;
      //disableBodyScroll(treeChartContainer);

      let treeChartRoot = document.getElementById("tree") as HTMLDivElement;
      treeChartContainer.removeChild(treeChartRoot);

      treeChartRoot = document.createElement("div");
      treeChartRoot.setAttribute("id", "tree");

      treeChartContainer.appendChild(treeChartRoot);

      treeChart(
        treeChartRoot,
        {
          name: process.env.NEXT_PUBLIC_SHORT_URL,
          children: inputNodes
        },
        {
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
            node: { radius: 14 },
            text: { colors: { default: isDark ? "white" : "black" } }
          },
          onClickText: (node) => {
            const url = "/" + normalize(node.name);
            router.push(url, url, { shallow: true });
          }
        }
      )();
    };

    setTimeout(() => renderChart(), 1000);

    if (!isMobile) {
      window.addEventListener("resize", renderChart);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", renderChart);
      });
    }

    return () => {
      // Anything in here is fired on component unmount
      //clearAllBodyScrollLocks();
      if (!isMobile) controller.abort();
    };
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={() => {
        //clearAllBodyScrollLocks();
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
