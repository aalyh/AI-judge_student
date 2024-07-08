import { NestArr } from '@/api/types';
import { PermissionItem, PermissionTreeNode } from '@/types/permissions';
import { TreeSelectProps } from '@arco-design/web-vue/es/tree-select/interface';
/**
 *
 * @param originTree
 * @returns 权限树页面需要的权限树结构
 */
export function initPermissionTree(originTree: NestArr<PermissionItem>[]): PermissionTreeNode[] {
  return originTree.map((node) => {
    return {
      id: node.id,
      title: node.name,
      key: node.key,
      children: node.children && node.children.length ? initPermissionTree(node.children) : [],
    };
  });
}

/**
 *
 * @param originTree
 * @returns 权限树select选择器需要的权限树结构
 */
export function initPermissionSelectTree(originTree: NestArr<PermissionItem>[]): TreeSelectProps['data'] {
  return originTree.map((node) => {
    return {
      title: node.name,
      value: node.id,
      key: node.id,
      children: node.children && node.children.length ? initPermissionSelectTree(node.children) : [],
    };
  });
}
