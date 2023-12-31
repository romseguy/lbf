import type d3 from "d3";

export type RenderChart = (tree: InputNode | void) => void;

export type Primitive = number | string | boolean;

export interface InputOptions {
  id: string;
  style: { [key: string]: any };
  aspectRatio: number;
  initialZoom: number;
  margin: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  isDark?: boolean;
  isFullscreen: boolean;
  isSorted: boolean;
  heightBetweenNodesCoeff: number;
  widthBetweenNodesCoeff: number;
  transitionDuration: number;
  onClickText: (clickedNode: TreeNodeWithId) => void;
  onClickCircle?: (clickedNode: TreeNodeWithId) => void;
  onZoom: () => void;
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
  name?: string;
  children?: InputNode[];
}

export interface TreeNode extends d3.layout.tree.Node {
  name: string;
  prefix?: string;
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
