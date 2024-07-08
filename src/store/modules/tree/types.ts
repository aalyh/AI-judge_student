import { NestArr } from '@/api/types';
import { PermissionItem, PermissionTreeNode } from '@/types/permissions';
import { TreeSelectProps } from '@arco-design/web-vue/es/tree-select/interface';

export interface TreeStateType {
  originPermissionTree: NestArr<PermissionItem>[];
  permissionTree: PermissionTreeNode[];
  permissionSelectTree: TreeSelectProps['data'];
}
