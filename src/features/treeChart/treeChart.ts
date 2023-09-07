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
  findParentNodePosition,
  panLimit
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
    onClickCircle,
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

  let layout = d3.layout
    .tree()
    .size([layoutHeight * heightBetweenNodesCoeff, layoutWidth]);
  if (isSorted)
    layout.sort((a, b) =>
      (b as TreeNode).name.toLowerCase() < (a as TreeNode).name.toLowerCase()
        ? 1
        : -1
    );

  //#region zoom
  let touchCount = 0;
  DOMNode.addEventListener(
    "touchstart",
    (e) => (touchCount = e.touches.length)
  );
  const xMax = layoutWidth * 2;
  const yMax = layoutHeight * 2;
  const panExtent = {
    x: [-xMax, xMax],
    y: [-yMax, yMax]
  };
  const x = d3.scale
    .linear()
    .domain([
      panExtent.x[0] > -layoutWidth / 2 ? panExtent.x[0] : -layoutWidth / 2,
      panExtent.x[1] < layoutWidth / 2 ? panExtent.x[1] : layoutWidth / 2
    ])
    .range([0, layoutWidth]);
  const y = d3.scale
    .linear()
    .domain([
      panExtent.y[0] > -layoutHeight / 2 ? panExtent.y[0] : -layoutHeight / 2,
      panExtent.y[1] < layoutHeight / 2 ? panExtent.y[1] : layoutHeight / 2
    ])
    .range([layoutHeight, 0]);
  let latestPanX: number;
  let latestPanY: number;
  const zoom = d3.behavior
    .zoom()
    .x(x)
    .y(y)
    .scaleExtent([0.5, 2])
    .scale(initialZoom)
    .on("zoom", () => {
      //if (touchCount === 1) return;
      const zoomEvent = d3.event as ZoomEvent;
      if (zoomEvent.sourceEvent) {
        zoomEvent.sourceEvent.stopPropagation();
        zoomEvent.sourceEvent.preventDefault();
      }
      const { translate, scale } = zoomEvent;
      const [tX, tY] = translate;

      const [panX, panY] = panLimit(
        panExtent,
        layoutHeight,
        layoutWidth,
        translate,
        zoom,
        x,
        y
      );
      //console.log("x", x.domain()[0], panExtent.x[0], tX, panX);
      //console.log("y", tY, panY);

      if (panX !== Infinity && panX !== -Infinity && !!panX) latestPanX = panX;
      if (panY !== Infinity && panY !== -Infinity && !!panY) latestPanY = panY;

      const transform = `translate(${latestPanX}, ${latestPanY}) scale(${scale})`;
      svg.attr("transform", transform);

      //zoom.translate([zoomx, zoomy]);
      // console.log(zoomx);
      // console.log(transform);

      onZoom && onZoom();
    });
  //#endregion

  const root = d3.select(DOMNode);
  const svg = root
    .append("svg")
    .attr({
      id,
      height: layoutHeight,
      width: layoutWidth,
      viewBox: `0 0 ${layoutWidth} ${layoutHeight * aspectRatio}`
    })
    .style({ ...style, cursor: "cell" })
    .call(zoom)
    .append("g")
    .attr({
      transform: `translate(${
        pl + (inputNode.name || "empty").length * 9 + style.node.radius
      }, 0) scale(${initialZoom})`
    });

  //root.on("touchstart.zoom", null);

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

  return function renderChart() {
    console.log("treeChart: render");
    let tree = inputNode;

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

      //#region update nodes
      const nodes = layout.nodes(tree) as TreeNodeWithId[];
      const nodePool = svg
        .selectAll("g.node")
        .property("__oldData__", (d: TreeNodeWithId) => d)
        .data(nodes, (d) => {
          if (!d.id) d.id = `${++nodeIndex}`;
          return d.id;
        });
      const nodePositionsById: { [nodeId: string]: NodePosition } =
        nodes.reduce((obj, node) => {
          return {
            ...obj,
            [node.id]: {
              ...node,
              parentId: node.parent ? node.parent.id : undefined
            }
          };
        }, {});

      //#region node pool enter
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
          fill: style.text.colors.default
          //cursor: "pointer"
        });
      // .on("mouseover", function mouseover(this: EventTarget) {
      //   d3.select(this).style({
      //     fill: style.text.colors.hover
      //   });
      // })
      // .on("mouseout", function mouseout(this: EventTarget) {
      //   d3.select(this).style({
      //     fill: style.text.colors.default
      //   });
      // });

      //#region node group
      const nodeGroup = poolEnter
        .append("g")
        .attr({
          fill: (d) =>
            d.parent?.name === process.env.NEXT_PUBLIC_SHORT_URL
              ? "blue"
              : "green"
        })
        .on("mouseover", function mouseover(this: EventTarget) {
          d3.select(this).attr({
            fill: "red"
          });
        })
        .on("mouseout", function mouseout(this: EventTarget, d) {
          d3.select(this).attr({
            fill:
              d.parent?.name === process.env.NEXT_PUBLIC_SHORT_URL
                ? "blue"
                : "green"
          });
        });

      // ORIGINALLY
      // nodeGroup
      // .append("circle")
      // .attr({
      //   class: "nodeCircle",
      //   r: 0
      // })

      nodeGroup
        .append("g")
        .attr({ transform: "translate(0, -10)" })
        .append("svg")
        .attr({
          height: "1.5em",
          width: "1.5em",
          // fill: (d) =>
          //   d.parent?.name === process.env.NEXT_PUBLIC_SHORT_URL
          //     ? "blue"
          //     : "green",
          viewBox: (d) => {
            if (d.name === process.env.NEXT_PUBLIC_SHORT_URL) return "0 0 0 0";
            if (d.parent?.name === process.env.NEXT_PUBLIC_SHORT_URL)
              return "0 0 496 512";
            return "0 0 384 512";
          }
        })
        .style({ cursor: "pointer" })
        .append("path")
        .attr({
          d: (d) => {
            if (d.parent?.name === process.env.NEXT_PUBLIC_SHORT_URL)
              return "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm200 248c0 22.5-3.9 44.2-10.8 64.4h-20.3c-4.3 0-8.4-1.7-11.4-4.8l-32-32.6c-4.5-4.6-4.5-12.1.1-16.7l12.5-12.5v-8.7c0-3-1.2-5.9-3.3-8l-9.4-9.4c-2.1-2.1-5-3.3-8-3.3h-16c-6.2 0-11.3-5.1-11.3-11.3 0-3 1.2-5.9 3.3-8l9.4-9.4c2.1-2.1 5-3.3 8-3.3h32c6.2 0 11.3-5.1 11.3-11.3v-9.4c0-6.2-5.1-11.3-11.3-11.3h-36.7c-8.8 0-16 7.2-16 16v4.5c0 6.9-4.4 13-10.9 15.2l-31.6 10.5c-3.3 1.1-5.5 4.1-5.5 7.6v2.2c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8s-3.6-8-8-8H247c-3 0-5.8 1.7-7.2 4.4l-9.4 18.7c-2.7 5.4-8.2 8.8-14.3 8.8H194c-8.8 0-16-7.2-16-16V199c0-4.2 1.7-8.3 4.7-11.3l20.1-20.1c4.6-4.6 7.2-10.9 7.2-17.5 0-3.4 2.2-6.5 5.5-7.6l40-13.3c1.7-.6 3.2-1.5 4.4-2.7l26.8-26.8c2.1-2.1 3.3-5 3.3-8 0-6.2-5.1-11.3-11.3-11.3H258l-16 16v8c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8v-20c0-2.5 1.2-4.9 3.2-6.4l28.9-21.7c1.9-.1 3.8-.3 5.7-.3C358.3 56 448 145.7 448 256zM130.1 149.1c0-3 1.2-5.9 3.3-8l25.4-25.4c2.1-2.1 5-3.3 8-3.3 6.2 0 11.3 5.1 11.3 11.3v16c0 3-1.2 5.9-3.3 8l-9.4 9.4c-2.1 2.1-5 3.3-8 3.3h-16c-6.2 0-11.3-5.1-11.3-11.3zm128 306.4v-7.1c0-8.8-7.2-16-16-16h-20.2c-10.8 0-26.7-5.3-35.4-11.8l-22.2-16.7c-11.5-8.6-18.2-22.1-18.2-36.4v-23.9c0-16 8.4-30.8 22.1-39l42.9-25.7c7.1-4.2 15.2-6.5 23.4-6.5h31.2c10.9 0 21.4 3.9 29.6 10.9l43.2 37.1h18.3c8.5 0 16.6 3.4 22.6 9.4l17.3 17.3c3.4 3.4 8.1 5.3 12.9 5.3H423c-32.4 58.9-93.8 99.5-164.9 103.1z";
            return "M378.31 378.49L298.42 288h30.63c9.01 0 16.98-5 20.78-13.06 3.8-8.04 2.55-17.26-3.28-24.05L268.42 160h28.89c9.1 0 17.3-5.35 20.86-13.61 3.52-8.13 1.86-17.59-4.24-24.08L203.66 4.83c-6.03-6.45-17.28-6.45-23.32 0L70.06 122.31c-6.1 6.49-7.75 15.95-4.24 24.08C69.38 154.65 77.59 160 86.69 160h28.89l-78.14 90.91c-5.81 6.78-7.06 15.99-3.27 24.04C37.97 283 45.93 288 54.95 288h30.63L5.69 378.49c-6 6.79-7.36 16.09-3.56 24.26 3.75 8.05 12 13.25 21.01 13.25H160v24.45l-30.29 48.4c-5.32 10.64 2.42 23.16 14.31 23.16h95.96c11.89 0 19.63-12.52 14.31-23.16L224 440.45V416h136.86c9.01 0 17.26-5.2 21.01-13.25 3.8-8.17 2.44-17.47-3.56-24.26z";
          }
        })
        .on("click", (clickedNode: TreeNodeWithId) => {
          if ((d3.event as Event).defaultPrevented) return;
          if (onClickCircle) onClickCircle(clickedNode);
          else toggleChildren(clickedNode);
          update();
        });

      nodeGroup
        .append("text")
        .attr({
          class: "nodeText",
          "text-anchor": "middle",
          dy: ".35em",
          dx: ".5em"
        })
        .style({
          cursor: "pointer",
          "fill-opacity": 0
        })
        .on("click", onClickText);
      //#endregion

      // update the text to reflect whether node has children or not
      nodePool.select("text").text((d) => `${d.prefix || ""}${d.name}`);

      // change the circle fill depending on whether it has children and is collapsed
      // nodePool.select("circle").style({
      //   stroke: "black",
      //   "stroke-width": "1.5px",
      //   fill: (d) =>
      //     d._children
      //       ? style.node.colors.collapsed
      //       : d.children
      //       ? style.node.colors.parent
      //       : style.node.colors.default
      // });
      //#endregion

      //#region node pool transition
      // transition nodes to their new position
      const nodeUpdate = nodePool
        .transition()
        .duration(transitionDuration)
        .attr({
          transform: (d) => `translate(${d.y},${d.x})`
        });

      // ensure circle radius is correct
      //nodeUpdate.select("circle").attr("r", style.node.radius);

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
      //#endregion

      //#region update links
      const links = layout.links(nodes);
      const linkPool = svg
        .selectAll("path.link")
        .data(links, (d) => (d.target as TreeNodeWithId).id);

      //#region link pool enter
      const diagonal = d3.svg
        .diagonal<NodePosition>()
        .projection((d) => [d.y!, d.x!]);

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
      //#endregion

      //#region link pool transition
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
      //#endregion

      // delete the old data once it's no longer needed
      nodePool.property("__oldData__", null);

      // stash the old positions for transition
      previousNodePositionsById = nodePositionsById;
    }
  };
};
