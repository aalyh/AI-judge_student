import useTreeStore from '@/store/modules/tree';
import { getSpecificValueArr } from '@/utils/arrayHelper';

const treeStore = useTreeStore();
const { flattenPermissionsTree, allParentIds } = treeStore;

/**
 * 给角色绑定权限使用, 组件逻辑+后端原因，UI显示需要回填parent效果，但是实际发送需要全部选中的父子权限, 这里得手动自己滤
 * @param chosenIds
 * @returns
 */
export default function getConnectedKidPermissions(chosenIds: number[]) {
  const res: number[] = [...chosenIds];
  // 拿到回填的id中的父权限
  const parentIdsIntersection = chosenIds.filter((item) => allParentIds.includes(item));

  const parentPermissions = flattenPermissionsTree.filter((permission) => parentIdsIntersection.includes(permission.id));

  parentPermissions.forEach((permission) => {
    res.push(...(getSpecificValueArr(permission, 'id') as number[]));
  });

  return [...new Set(res)];
}
