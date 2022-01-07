import d3, { ZoomEvent } from "d3";
import deepmerge from "deepmerge";
import { visit } from "utils/tree";
import {
  InputOptions,
  InputNode,
  TreeNode,
  TreeNodeWithId,
  NodePosition,
  Primitive,
  RenderChart
} from "./types";
import {
  //getTooltipString,
  toggleChildren,
  getNodeGroupByDepthCount,
  findParentNodePosition
} from "./utils";
//import d3tooltip from 'd3tooltip';

export const defaultOptions: InputOptions = {
  aspectRatio: 1.0,
  heightBetweenNodesCoeff: 2,
  id: "d3svg",
  initialZoom: 1,
  isFullscreen: false,
  isSorted: false,
  margin: {},
  padding: {},
  onClickText: () => {},
  onZoom: () => {},
  size: 500,
  style: {
    node: {
      colors: {
        default: "#ccc",
        collapsed: "lightsteelblue",
        parent: "white"
      },
      radius: 7
    },
    text: {
      colors: {
        default: "black",
        hover: "skyblue"
      }
    },
    link: {
      stroke: "#000",
      fill: "none"
    }
  },
  // tooltipOptions: {
  //   disabled: false,
  //   left: undefined,
  //   top: undefined,
  //   offset: {
  //     left: 0,
  //     top: 0
  //   },
  //   style: undefined
  // },
  transitionDuration: 750,
  widthBetweenNodesCoeff: 1
};

export const treeChart = (
  DOMNode: HTMLElement,
  inputNode: InputNode,
  config: Partial<InputOptions> = {}
): RenderChart => {
  const options = deepmerge(defaultOptions, config);
  console.log("treeChart: options", options);

  const {
    aspectRatio,
    heightBetweenNodesCoeff,
    id,
    initialZoom,
    isFullscreen,
    isSorted,
    margin,
    padding,
    onClickText,
    onZoom,
    size,
    style,
    //tooltipOptions,
    transitionDuration,
    widthBetweenNodesCoeff
  } = options;

  const pl = padding.left || 0;
  const pr = padding.right || 0;
  const mb = margin.bottom || 0;
  const ml = margin.left || 0;
  const mr = margin.right || 0;
  const mt = margin.top || 0;
  const mx = ml + mr;
  const my = mt + mb;

  const layoutHeight = isFullscreen ? window.innerHeight - my : size - my;
  const layoutWidth = isFullscreen ? window.innerWidth - mx : size - mx;

  let layout = d3.layout.tree().size([layoutHeight, layoutWidth]);
  if (isSorted)
    layout.sort((a, b) =>
      (b as TreeNode).name.toLowerCase() < (a as TreeNode).name.toLowerCase()
        ? 1
        : -1
    );

  const root = d3.select(DOMNode);
  const zoom = d3.behavior.zoom().scaleExtent([0.1, 3]).scale(initialZoom);
  const vis = root
    .append("svg")
    .attr({
      id,
      height: layoutHeight,
      width: layoutWidth,
      viewBox: `0 0 ${layoutWidth} ${layoutHeight * aspectRatio}`
    })
    .style({ ...style, cursor: "cell" })
    .call(
      zoom.on("zoom", () => {
        const zoomEvent = d3.event as ZoomEvent;
        const { translate, scale } = zoomEvent;
        zoomEvent.sourceEvent?.stopPropagation();

        // if (touchCount === 1) return;

        vis.attr(
          "transform",
          `translate(${translate.toString()})scale(${scale})`
        );
        onZoom && onZoom();
      })
    )
    .append("g")
    .attr({
      transform: `translate(${
        pl + (inputNode.name || "empty").length * 9 + style.node.radius
      }, 0) scale(${initialZoom})`
    });

  // previousNodePositionsById stores node x and y
  // as well as hierarchy (id / parentId);
  // helps animating transitions
  let previousNodePositionsById: { [nodeId: string]: NodePosition } = {
    root: {
      id: "root",
      parentId: null,
      x: layoutHeight / 2,
      y: 0
    }
  };

  return function renderChart(tree: InputNode | undefined = inputNode) {
    console.log("treeChart: render");

    if (!Object.keys(tree).length || !tree.name) {
      tree = {
        name: "empty"
      };
    }

    visit(
      tree,
      (node: TreeNodeWithId) => {
        node.id = node.id || "root";
      },
      (node: TreeNodeWithId) => {
        return Array.isArray(node.children) && node.children.length > 0
          ? node.children.map((c) => {
              c.id = `${node.id || ""}|${c.name}`;
              return c;
            })
          : undefined;
      }
    );

    let nodeIndex = 0;
    update();

    function update() {
      console.log("treeChart: update");

      const diagonal = d3.svg
        .diagonal<NodePosition>()
        .projection((d) => [d.y!, d.x!]);

      // update nodes
      const treeNodes = layout.nodes(tree) as TreeNodeWithId[];
      const nodePool = vis
        .selectAll("g.node")
        .property("__oldData__", (d: TreeNodeWithId) => d)
        .data(treeNodes, (d) => {
          if (!d.id) d.id = `${++nodeIndex}`;
          return d.id;
        });

      //#region node pool enter
      const nodePositionsById: { [nodeId: string]: NodePosition } =
        treeNodes.reduce((obj, treeNode) => {
          return {
            ...obj,
            [treeNode.id]: {
              ...treeNode,
              parentId: treeNode.parent ? treeNode.parent.id : undefined
            }
          };
        }, {});
      const poolEnter = nodePool
        .enter()
        .append("g")
        .attr({
          class: "node",
          transform: (d) => {
            const position = findParentNodePosition(
              nodePositionsById,
              d.id,
              (n) => !!previousNodePositionsById[n.id]
            );
            const previousPosition =
              (position && previousNodePositionsById[position.id]) ||
              previousNodePositionsById.root;
            return `translate(${previousPosition.y},${previousPosition.x})`;
          }
        })
        .style({
          fill: style.text.colors.default,
          cursor: "pointer"
        })
        .on("mouseover", function mouseover(this: EventTarget) {
          d3.select(this).style({
            fill: style.text.colors.hover
          });
        })
        .on("mouseout", function mouseout(this: EventTarget) {
          d3.select(this).style({
            fill: style.text.colors.default
          });
        });

      const nodeGroup = poolEnter.append("g");

      nodeGroup
        .append("circle")
        .attr({
          class: "nodeCircle",
          r: 0
        })
        .on("click", (clickedNode: TreeNodeWithId) => {
          if ((d3.event as Event).defaultPrevented) return;
          toggleChildren(clickedNode);
          update();
        });

      nodeGroup
        .append("text")
        .attr({
          class: "nodeText",
          "text-anchor": "middle",
          transform: "translate(0,0)",
          dy: ".35em"
        })
        .style({
          "fill-opacity": 0
        })
        .on("click", onClickText);

      // update the text to reflect whether node has children or not
      nodePool.select("text").text((d) => d.name);

      // change the circle fill depending on whether it has children and is collapsed
      nodePool.select("circle").style({
        stroke: "black",
        "stroke-width": "1.5px",
        fill: (d) =>
          d._children
            ? style.node.colors.collapsed
            : d.children
            ? style.node.colors.parent
            : style.node.colors.default
      });

      // transition nodes to their new position
      const nodeUpdate = nodePool
        .transition()
        .duration(transitionDuration)
        .attr({
          transform: (d) => `translate(${d.y},${d.x})`
        });

      // ensure circle radius is correct
      nodeUpdate.select("circle").attr("r", style.node.radius);

      // fade the text in and align it
      nodeUpdate
        .select("text")
        .style("fill-opacity", 1)
        .attr({
          transform: function transform(this: SVGGraphicsElement, d) {
            const x =
              (d.children || d._children ? -1 : 1) *
              (this.getBBox().width / 2 + style.node.radius + 5);
            return `translate(${x},0)`;
          }
        });
      //#endregion

      //#region node pool exit
      // transition exiting nodes to the parent's new position
      const poolExit = nodePool
        .exit()
        .transition()
        .duration(transitionDuration)
        .attr({
          transform: (d) => {
            const position = findParentNodePosition(
              previousNodePositionsById,
              d.id,
              (n) => !!nodePositionsById[n.id]
            );
            const futurePosition =
              (position && nodePositionsById[position.id]) ||
              nodePositionsById.root;
            return `translate(${futurePosition.y!},${futurePosition.x!})`;
          }
        })
        .remove();

      poolExit.select("circle").attr("r", 0);
      poolExit.select("text").style("fill-opacity", 0);
      //#endregion

      // update links
      const links = layout.links(treeNodes);
      const linkPool = vis
        .selectAll("path.link")
        .data(links, (d) => (d.target as TreeNodeWithId).id);

      //#region link pool enter
      // enter any new links at the parent's previous position
      linkPool
        .enter()
        .insert("path", "g")
        .attr({
          class: "link",
          d: (d) => {
            const position = findParentNodePosition(
              nodePositionsById,
              (d.target as TreeNodeWithId).id,
              (n) => !!previousNodePositionsById[n.id]
            );

            const previousPosition =
              (position && previousNodePositionsById[position.id]) ||
              previousNodePositionsById.root;

            return diagonal({
              source: previousPosition,
              target: previousPosition
            });
          }
        })
        .style(style.link);

      // transition links to their new position
      linkPool
        .transition()
        .duration(transitionDuration)
        .attr({
          d: diagonal as unknown as Primitive
        });
      //#endregion

      //#region link pool exit
      // transition exiting nodes to the parent's new position
      linkPool
        .exit()
        .transition()
        .duration(transitionDuration)
        .attr({
          d: (d) => {
            const position = findParentNodePosition(
              previousNodePositionsById,
              (d.target as TreeNodeWithId).id,
              (n) => !!nodePositionsById[n.id]
            );
            const futurePosition =
              (position && nodePositionsById[position.id]) ||
              nodePositionsById.root;
            return diagonal({
              source: futurePosition,
              target: futurePosition
            });
          }
        })
        .remove();
      //#endregion

      // delete the old data once it's no longer needed
      nodePool.property("__oldData__", null);

      // stash the old positions for transition
      previousNodePositionsById = nodePositionsById;
    }
  };
};
