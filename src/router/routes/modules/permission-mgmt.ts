import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PERMISSION_MGMT: AppRouteRecordRaw = {
  path: '/permission-mgmt',
  name: 'permission-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '权限管理',
    requiresAuth: true,
    roles: ['root', 'permission', 'role', 'user'],
    icon: 'icon-lock',
    order: 1,
  },
  children: [
    // {
    //   path: 'tree',
    //   name: 'tree',
    //   component: () => import('@/views/permission-mgmt/tree/index.vue'),
    //   meta: {
    //     locale: '权限树',
    //     requiresAuth: true,
    //     roles: ['root', 'permission'],
    //   },
    // },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/permission-mgmt/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['root', 'role'],
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/permission-mgmt/user/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
        roles: ['root', 'user'],
      },
    },
  ],
};

export default PERMISSION_MGMT;
