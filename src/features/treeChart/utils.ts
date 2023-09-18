// import { is, join, pipe, replace } from 'ramda';
import { InputNode, TreeNodeWithId, NodePosition } from "./types";

export function collapseChildren(node: TreeNodeWithId) {
  if (node.children) {
    node._children = node.children;
    node._children.forEach(collapseChildren);
    node.children = undefined;
  }
}

export function expandChildren(node: TreeNodeWithId) {
  if (node._children) {
    node.children = node._children;
    node.children.forEach(expandChildren);
    node._children = undefined;
  }
}

export function toggleChildren(node: TreeNodeWithId) {
  if (node.children) {
    node._children = node.children;
    node.children = undefined;
  } else if (node._children) {
    node.children = node._children;
    node._children = undefined;
  }
  return node;
}

export function getNodeGroupByDepthCount(rootNode: InputNode) {
  const nodeGroupByDepthCount = [1];

  const traverseFrom = function traverseFrom(node: InputNode, depth = 0) {
    if (!node.children || node.children.length === 0) {
      return 0;
    }

    if (nodeGroupByDepthCount.length <= depth + 1) {
      nodeGroupByDepthCount.push(0);
    }

    nodeGroupByDepthCount[depth + 1] += node.children.length;

    node.children.forEach((childNode) => {
      traverseFrom(childNode, depth + 1);
    });
  };

  traverseFrom(rootNode);
  return nodeGroupByDepthCount;
}

// traverses a map with node positions by going through the chain
// of parent ids; once a parent that matches the given filter is found,
// the parent position gets returned
export function findParentNodePosition(
  nodePositionsById: { [nodeId: string]: NodePosition },
  nodeId: string,
  filter: (nodePosition: NodePosition) => boolean
) {
  let currentPosition = nodePositionsById[nodeId];
  while (currentPosition) {
    currentPosition = nodePositionsById[currentPosition.parentId!];
    if (!currentPosition) {
      return null;
    }
    if (!filter || filter(currentPosition)) {
      return currentPosition;
    }
  }
}

// function sortObject(obj: unknown, strict?: boolean) {
//   if (obj instanceof Array) {
//     let ary;
//     if (strict) {
//       ary = obj.sort();
//     } else {
//       ary = obj;
//     }
//     return ary;
//   }

//   if (obj && typeof obj === 'object') {
//     const tObj: { [key: string]: unknown } = {};
//     Object.keys(obj)
//       .sort()
//       .forEach((key) => (tObj[key] = sortObject(obj[key as keyof typeof obj])));
//     return tObj;
//   }

//   return obj;
// }

// function sortAndSerialize(obj: unknown) {
//   return JSON.stringify(sortObject(obj, true), undefined, 2);
// }

// export function getTooltipString(
//   node: unknown,
//   i: number | undefined,
//   { indentationSize = 4 }
// ) {
//   if (!is(Object, node)) return '';

//   const spacer = join('&nbsp;&nbsp;');
//   const cr2br = replace(/\n/g, '<br/>');
//   const spaces2nbsp = replace(/\s{2}/g, spacer(new Array(indentationSize)));
//   const json2html = pipe(sortAndSerialize, cr2br, spaces2nbsp);

//   const children = (node as any).children || (node as any)._children;

//   if (typeof (node as any).value !== 'undefined')
//     return json2html((node as any).value);
//   if (typeof (node as any).object !== 'undefined')
//     return json2html((node as any).object);
//   if (children && children.length)
//     return `childrenCount: ${(children as unknown[]).length}`;
//   return 'empty';
// }

// let touchCount = 0;
// DOMNode.addEventListener("touchstart", (e) => {
//   touchCount = e.touches.length;
// });

export const panLimit = (
  panExtent: {
    x: number[];
    y: number[];
  },
  // height: number,
  // width: number,
  translate: number[],
  //zoom: d3.behavior.Zoom<unknown>,
  x: d3.scale.Linear<number, number>,
  y: d3.scale.Linear<number, number>
): [number, number] => {
  // const divisor = {
  //     h: height / ((y.domain()[1] - y.domain()[0]) * zoom.scale()),
  //     w: width / ((x.domain()[1] - x.domain()[0]) * zoom.scale())
  //   },
  // minX = -(
  //   (x.domain()[0] - x.domain()[1]) * zoom.scale() +
  //   (panExtent.x[1] - (panExtent.x[1] - width / divisor.w))
  // ),
  // minY =
  //   -(
  //     (y.domain()[0] - y.domain()[1]) * zoom.scale() +
  //     (panExtent.y[1] -
  //       (panExtent.y[1] - (height * zoom.scale()) / divisor.h))
  //   ) * divisor.h,
  // maxX =
  //   -(x.domain()[0] - x.domain()[1] + (panExtent.x[1] - panExtent.x[0])) *
  //   divisor.w *
  //   zoom.scale(),
  // maxY =
  //   ((y.domain()[0] - y.domain()[1]) * zoom.scale() +
  //     (panExtent.y[1] - panExtent.y[0])) *
  //   divisor.h *
  //   zoom.scale(),
  const tx =
      x.domain()[0] < panExtent.x[0]
        ? /*minX*/ Infinity
        : x.domain()[1] > panExtent.x[1]
        ? /*maxX*/ -Infinity
        : translate[0],
    ty =
      y.domain()[0] < panExtent.y[0]
        ? /*minY*/ Infinity
        : y.domain()[1] > panExtent.y[1]
        ? /*maxY*/ -Infinity
        : translate[1];

  return [tx, ty];
};
