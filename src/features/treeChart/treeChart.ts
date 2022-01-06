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
  blinkDuration: 100,
  heightBetweenNodesCoeff: 2,
  id: "d3svg",
  initialZoom: 1,
  isSorted: false,
  margin: {
    top: 0,
    right: 10,
    bottom: 10,
    left: 60
  },
  onClickText: () => {},
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
  options: Partial<InputOptions> = {}
): RenderChart => {
  console.log("treeChart: setup");

  const {
    aspectRatio,
    blinkDuration,
    heightBetweenNodesCoeff,
    id,
    initialZoom,
    isSorted,
    margin,
    onClickText,
    size,
    style,
    //tooltipOptions,
    transitionDuration,
    widthBetweenNodesCoeff
  }: InputOptions = deepmerge(defaultOptions, options);

  const defaultWidth = size - margin.left - margin.right;
  const defaultHeight = size * aspectRatio - margin.top - margin.bottom;

  const attr: { [key: string]: number | string } = {
    id,
    preserveAspectRatio: "xMinYMin slice"
  };

  if (!style.width) {
    attr.width = size;
  }

  if (!style.width || !style.height) {
    attr.viewBox = `0 0 ${size} ${size * aspectRatio}`;
  }

  const diagonal = d3.svg
    .diagonal<NodePosition>()
    .projection((d) => [d.y!, d.x!]);
  const root = d3.select(DOMNode);
  const vis = root
    .append("svg")
    .attr(attr)
    .style({ ...style, cursor: "cell" })
    .call(
      d3.behavior
        .zoom()
        .scaleExtent([0.1, 3])
        .scale(initialZoom)
        .on("zoom", () => {
          const { translate, scale } = d3.event as ZoomEvent;
          vis.attr(
            "transform",
            `translate(${translate.toString()})scale(${scale})`
          );
        })
    )
    .append("g")
    .attr({
      transform: `translate(${margin.left + style.node.radius}, ${
        margin.top
      }) scale(${initialZoom})`
    });

  let layout = d3.layout.tree().size([defaultWidth, defaultHeight]);

  if (isSorted)
    layout.sort((a, b) =>
      (b as TreeNode).name.toLowerCase() < (a as TreeNode).name.toLowerCase()
        ? 1
        : -1
    );

  // previousNodePositionsById stores node x and y
  // as well as hierarchy (id / parentId);
  // helps animating transitions
  let previousNodePositionsById: { [nodeId: string]: NodePosition } = {
    root: {
      id: "root",
      parentId: null,
      x: defaultHeight / 2,
      y: 0
    }
  };

  return function renderChart(tree: InputNode) {
    console.log("treeChart: render");
    let maxLabelLength = 0;

    if (!Object.keys(tree).length || !tree.name) {
      tree = {
        name: "empty"
      };
    }

    visit(
      tree,
      (node: TreeNodeWithId) => {
        maxLabelLength = Math.max(node.name.length, maxLabelLength);
        node.id = node.id || "root";
        node.y = maxLabelLength * 7 * widthBetweenNodesCoeff;
      },
      (node: TreeNodeWithId) =>
        Array.isArray(node.children) && node.children.length > 0
          ? node.children.map((c) => {
              c.id = `${node.id || ""}|${c.name}`;
              return c;
            })
          : undefined
    );

    let nodeIndex = 0;
    update();

    function update() {
      console.log("treeChart: update");

      // set tree layout dimensions and spacing between branches and nodes
      const maxNodeCountByLevel = Math.max(...getNodeGroupByDepthCount(tree));
      layout = layout.size([
        maxNodeCountByLevel * 25 * heightBetweenNodesCoeff,
        defaultWidth
      ]);

      const treeNodes = layout.nodes(tree) as TreeNodeWithId[];
      const links = layout.links(treeNodes);

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

      const pool = vis
        .selectAll("g.node")
        .property("__oldData__", (d: TreeNodeWithId) => d)
        .data(treeNodes, (d) => {
          if (!d.id) d.id = `${++nodeIndex}`;
          return d.id;
        });

      const poolEnter = pool
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
      pool.select("text").text((d) => d.name);

      // change the circle fill depending on whether it has children and is collapsed
      pool.select("circle").style({
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
      const nodeUpdate = pool
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

      // transition exiting nodes to the parent's new position
      const poolExit = pool
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

      // update the links
      const link = vis
        .selectAll("path.link")
        .data(links, (d) => (d.target as TreeNodeWithId).id);

      // enter any new links at the parent's previous position
      link
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
      link
        .transition()
        .duration(transitionDuration)
        .attr({
          d: diagonal as unknown as Primitive
        });

      // transition exiting nodes to the parent's new position
      link
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

      // delete the old data once it's no longer needed
      pool.property("__oldData__", null);

      // stash the old positions for transition
      previousNodePositionsById = nodePositionsById;
    }
  };
};
