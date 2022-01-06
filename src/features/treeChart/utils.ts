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
