import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

/**
 * TS is teacher&student
 */

const TS_MGMT: AppRouteRecordRaw = {
  path: '/ts-mgmt',
  name: 'ts-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '师生管理',
    requiresAuth: true,
    roles: ['root', 'teacher', 'stu'],
    icon: 'icon-user-group',
    order: 2,
  },
  children: [
    {
      path: 'teacher',
      name: 'teacher',
      component: () => import('@/views/ts-mgmt/teacher/index.vue'),
      meta: {
        locale: '教师管理',
        requiresAuth: true,
        roles: ['root', 'teacher'],
      },
    },
    {
      path: 'student',
      name: 'student',
      component: () => import('@/views/ts-mgmt/student/index.vue'),
      meta: {
        locale: '学生管理',
        requiresAuth: true,
        roles: ['root', 'stu'],
      },
    },
  ],
};

export default TS_MGMT;
