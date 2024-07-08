import type { RouteRecordName, Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

// 路由切换时, 从部分页面离开会出现目的路由无法加载的问题, 需要手动reload
const needReloadFrom: RouteRecordName[] = ['judgePlatform'];
const needReoladTo: RouteRecordName[] = [''];
function setupAfterPageGuard(router: Router) {
  router.afterEach((to, from) => {
    const { name: fromName } = from;
    const { name: toName } = to;
    if (fromName && needReloadFrom.includes(fromName)) {
      setTimeout(() => {
        location.reload(); // eslint-disable-line
      }, 1000);
    }
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupAfterPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
