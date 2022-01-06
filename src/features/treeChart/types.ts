import type d3 from "d3";

export type RenderChart = (tree: InputNode) => void;

export type Primitive = number | string | boolean;

export interface InputOptions {
  id: string;
  style: { [key: string]: any };
  size: number;
  aspectRatio: number;
  initialZoom: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isSorted: boolean;
  heightBetweenNodesCoeff: number;
  widthBetweenNodesCoeff: number;
  transitionDuration: number;
  blinkDuration: number;
  onClickText: (datum: TreeNodeWithId) => void;
  tooltipOptions?: {
    disabled?: boolean;
    left?: number | undefined;
    top?: number | undefined;
    offset?: {
      left: number;
      top: number;
    };
    style?: { [key: string]: any } | undefined;
    indentationSize?: number;
  };
}

export interface InputNode {
  name: string;
  children?: InputNode[];
}

export interface TreeNode extends d3.layout.tree.Node {
  name: string;
  children?: TreeNode[];
  _children?: TreeNode[];
}

export interface TreeNodeWithId extends TreeNode {
  id: string;
  // name: string;

  children?: TreeNodeWithId[];
  _children?: TreeNodeWithId[];

  parent?: TreeNodeWithId;

  value?: unknown;
  // x?: number;
  // y?: number;
}

export interface NodePosition {
  parentId: string | null | undefined;
  id: string;
  x: number | undefined;
  y: number | undefined;
}
