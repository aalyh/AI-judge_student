import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SUBJECT_MGMT: AppRouteRecordRaw = {
  path: '/subject-mgmt',
  name: 'subject-mgmt',
  component: DEFAULT_LAYOUT,
  redirect: '/subject-mgmt/index',
  meta: {
    locale: '学科管理',
    requiresAuth: true,
    roles: ['root', 'answerSheet', 'subject'],
    icon: 'icon-book', // TODO: replace me
    hideChildrenInMenu: true,
    order: 6,
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/subject-mgmt/index.vue'),
      meta: {
        locale: '学科管理',
        requiresAuth: true,
        activeMenu: 'subject-mgmt',
        roles: ['root', 'subject'],
      },
    },
    {
      path: 'answerSheet',
      name: 'answerSheet',
      component: () => import('@/views/subject-mgmt/children/answerSheet.vue'),
      meta: {
        locale: '答题卡配置',
        requiresAuth: true,
        activeMenu: 'subject-mgmt',
        roles: ['root', 'answerSheet'],
      },
    },
  ],
};

export default SUBJECT_MGMT;
