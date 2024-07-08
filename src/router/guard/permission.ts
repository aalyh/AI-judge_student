import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import useTreeStore from '@/store/modules/tree/index';
import { NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    // 有tree权限再去请求完整树
    if (userStore.permissions.includes('permission-tree')) {
      useTreeStore().init();
    }
    // eslint-disable-next-line no-lonely-if
    const { name: toName } = to;
    const { name: fromName } = from;
    if (permissionsAllow) {
      if (toName === 'login') {
        to.meta.isRefreash = typeof fromName === 'undefined' ? 0 : 2;
      }
      next();
    } else {
      next(NOT_FOUND);
    }
    NProgress.done();
  });
}
