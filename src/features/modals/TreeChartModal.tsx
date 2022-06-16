import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  Icon
} from "@chakra-ui/react";
import AbortController from "abort-controller";
//import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { treeChart } from "features/treeChart/treeChart";
import { InputNode, TreeNodeWithId } from "features/treeChart/types";
import theme from "theme/theme";
import { normalize } from "utils/string";
import { IoIosGitNetwork } from "react-icons/io";

const controller = new AbortController();
const signal = controller.signal;
let treeChartContainer: HTMLElement | null | undefined;

export const TreeChartModal = ({
  inputNodes,
  isMobile,
  header,
  rootName,
  ...props
}: {
  inputNodes: InputNode[];
  isMobile: boolean;
  isOpen: boolean;
  header?: React.ReactNode | React.ReactNodeArray;
  rootName?: string;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  useEffect(() => {
    const onClick = (node: TreeNodeWithId) => {
      const url = "/" + normalize(node.name);
      console.log(url);

      router.push(url, url, { shallow: true });
      props.onClose();
    };
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
          name: rootName || process.env.NEXT_PUBLIC_SHORT_URL,
          children: inputNodes
        },
        {
          id: "treeSvg",
          initialZoom: 0.8,
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
            background: isDark
              ? theme.colors.gray["800"]
              : theme.colors.gray["50"],
            link: { stroke: isDark ? "#fff" : "#000" },
            node: { radius: 14 },
            text: { colors: { default: isDark ? "white" : "black" } }
          },
          onClickCircle: onClick,
          onClickText: onClick
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
      size="full"
      onClose={() => {
        //clearAllBodyScrollLocks();
        props.onClose && props.onClose();
      }}
    >
      <ModalOverlay>
        <ModalContent my={0} minHeight="100vh" borderRadius={0}>
          <ModalHeader display="flex" alignItems="center">
            {header ? header : "Arborescence"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody id="treeC" p={0} display="flex" flexDirection="column">
            <div id="tree" />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
