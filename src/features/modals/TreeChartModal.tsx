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
import theme from "features/layout/theme";
import { normalize } from "utils/string";
import { IoIosGitNetwork } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

const controller = new AbortController();
const signal = controller.signal;
let treeChartContainer: HTMLElement | null | undefined;

export const TreeChartModal = ({
  inputNodes,
  header,
  rootName,
  ...props
}: {
  inputNodes: InputNode[];
  isOpen: boolean;
  header?: React.ReactNode | React.ReactNodeArray;
  rootName?: string;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();

  useEffect(() => {
    if (inputNodes.length > 0) {
      const onClick = (node: TreeNodeWithId) => {
        const url =
          node.name === process.env.NEXT_PUBLIC_SHORT_URL
            ? "/"
            : "/" + normalize(node.name);
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
            name: rootName,
            children: inputNodes
          },
          {
            id: "treeSvg",
            initialZoom: 0.8,
            isDark,
            isFullscreen: true,
            isSorted: true,
            heightBetweenNodesCoeff: 2.5,
            widthBetweenNodesCoeff: 1,
            aspectRatio: 1.5,
            margin: {
              top: 88
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
