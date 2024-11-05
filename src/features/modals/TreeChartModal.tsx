import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useColorMode
} from "@chakra-ui/react";
import AbortController from "abort-controller";
//import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { treeChart } from "features/treeChart/treeChart";
import { InputNode, TreeNodeWithId } from "features/treeChart/types";
import theme from "features/layout/theme";
import { normalize } from "utils/string";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { useGetElementAsync } from "hooks/useGetElementAsync";
import { useToast } from "hooks/useToast";

const controller = new AbortController();
const signal = controller.signal;
// let container: Element | null | undefined;
// let root: Element | null | undefined;

function renderChart({
  // container,
  // root,
  rootName,
  inputNodes,
  isDark,
  onClick
}: {
  // container: Element;
  // root: Element;
  rootName: string;
  inputNodes: InputNode[];
  isDark: boolean;
  onClick: (node: TreeNodeWithId) => void;
}) {
  let container = document.querySelector("#treeC");
  let root = container ? container.querySelector("#tree") : null;

  if (container && root) container.removeChild(root);

  root = document.createElement("div");
  root.setAttribute("id", "tree");

  if (container) container.appendChild(root);
  const inputNodesCount = inputNodes.reduce((count, inputNode) => {
    let newCount = count + 1;
    if (inputNode.children) newCount += inputNode.children.length;
    return newCount;
  }, 0);
  const heightBetweenNodesCoeff =
    inputNodesCount > 115
      ? 9.5
      : inputNodesCount > 40
      ? 7.5
      : inputNodesCount > 15
      ? 2.5
      : 1.5;
  // // console.log(
  // //   "🚀 ~ heightBetweenNodesCoeff ~ heightBetweenNodesCoeff:",
  // //   heightBetweenNodesCoeff,
  // //   inputNodesCount
  // // );
  treeChart(
    root as HTMLElement,
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
      heightBetweenNodesCoeff,
      widthBetweenNodesCoeff: 1,
      aspectRatio: 1.5,
      margin: {
        top: 88
      },
      padding: {},
      style: {
        background: isDark ? theme.colors.gray["800"] : theme.colors.gray["50"],
        link: { stroke: isDark ? "#fff" : "#000" },
        node: { radius: 14 },
        text: {
          colors: {
            default: isDark ? "lightgreen" : "green",
            parent: isDark ? "white" : "blue"
          }
        }
      },
      onClickCircle: onClick,
      onClickText: onClick
    }
  )();
}

export const TreeChartModal = ({
  inputNodes,
  header,
  rootName = "",
  keyword,
  ...props
}: {
  inputNodes: InputNode[];
  isOpen: boolean;
  header?: React.ReactNode | React.ReactNodeArray;
  rootName?: string;
  keyword?: string;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const onClick = (node: TreeNodeWithId) => {
    const url =
      node.name === process.env.NEXT_PUBLIC_SHORT_URL
        ? "/"
        : "/" + normalize(node.name);
    router.push(url, url, { shallow: true });
    props.onClose();
  };

  const container = useGetElementAsync("#treeC");
  const root = useGetElementAsync("#tree");

  useEffect(() => {
    if (!inputNodes.length) {
      console.log("🚀 NO NODES");
      if (keyword)
        toast({ title: "Le mot clé " + keyword + " n'a pas été trouvé" });
    }

    if (!container) {
      // console.log("🚀 NO CONTAINER");
      return () => {};
    }

    if (!root) {
      // console.log("🚀 NO ROOT");
      return () => {};
    }

    function redraw() {
      if (root && container) {
        // console.log("🚀 REDRAW");
        renderChart({
          rootName,
          inputNodes,
          isDark,
          onClick
        });
      }
    }

    redraw();

    if (!isMobile) {
      window.addEventListener("resize", redraw);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", redraw);
      });
    }

    return () => {
      // Anything in here is fired on component unmount
      if (!isMobile) controller.abort();
    };
  }, [container, root, inputNodes]);

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
