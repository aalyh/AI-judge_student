import { defineStore } from 'pinia';
import { getPermissionTreeAPI } from '@/api/permissions';
import { PermissionItem } from '@/types/permissions';
import { initPermissionTree, initPermissionSelectTree } from '@/utils/permissions';
import { flatten } from '@/utils/arrayHelper';
import { NestArr } from '@/api/types';
import { TreeStateType } from './types';

const useTreeStore = defineStore('tree', {
  state: (): TreeStateType => {
    return {
      originPermissionTree: [],
      permissionTree: [],
      permissionSelectTree: [],
    };
  },
  actions: {
    init() {
      if (this.originPermissionTree.length) return;
      getPermissionTreeAPI().then(({ data }) => {
        this.originPermissionTree = data;
        this.permissionTree = initPermissionTree(data);
        this.permissionSelectTree = initPermissionSelectTree(data);
      });
    },
  },
  getters: {
    flattenPermissionsTree() {
      return flatten<NestArr<PermissionItem>>(this.originPermissionTree);
    },
    allParentIds() {
      const parentPermissions: NestArr<PermissionItem>[] = this.flattenPermissionsTree.filter(
        (p: NestArr<PermissionItem>) => p.children && p.children.length,
      );
      const res: number[] = [];
      parentPermissions.forEach((p) => {
        res.push(p.id);
      });
      return res;
    },
  },
});

export default useTreeStore;
