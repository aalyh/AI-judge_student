import { TreeNodeData } from '@arco-design/web-vue';

export interface PermissionItem {
  [key: string]: unknown;
  desc: string;
  icon: string;
  id: number;
  key: string;
  name: string;
  parentId: number;
  url: string;
}

export type PermissionTreeNode = TreeNodeData & { id: number };

export interface BaseRole {
  [key: string]: any;
  id?: number;
  key: string;
  name: string;
  desc: string;
  auth: number[];
}
