import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EXAM_MGMT: AppRouteRecordRaw = {
  path: '/exam-mgmt',
  name: 'exam-mgmt',
  component: DEFAULT_LAYOUT,
  redirect: '/exam-mgmt/examIndex',
  meta: {
    locale: '考试管理',
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['root', 'exam'],
    icon: 'icon-subscribed',
    order: 5,
  },
  children: [
    {
      path: 'examIndex',
      name: 'examIndex',
      component: () => import('@/views/exam-mgmt/index.vue'),
      meta: {
        locale: '考试管理',
        requiresAuth: true,
        activeMenu: 'exam-mgmt',
        roles: ['root', 'exam'],
      },
    },
    {
      path: 'examDetail',
      name: 'examDetail',
      component: () => import('@/views/exam-mgmt/children/detail.vue'),
      meta: {
        locale: '考试详情',
        requiresAuth: true,
        activeMenu: 'exam-mgmt',
        roles: ['root', 'exam'],
      },
    },
    {
      path: 'judgePlatform',
      name: 'judgePlatform',
      component: () => import('@/views/exam-mgmt/children/judgePlatform.vue'),
      meta: {
        locale: '阅卷平台',
        requiresAuth: true,
        activeMenu: 'exam-mgmt',
        roles: ['root', 'exam'],
      },
    },
    {
      path: 'chartPage',
      name: 'chartPage',
      component: () => import('@/views/exam-mgmt/children/chartPage.vue'),
      meta: {
        locale: '考试分析',
        requiresAuth: true,
        activeMenu: 'exam-mgmt',
        roles: ['root', 'exam'],
      },
    },
  ],
};

export default EXAM_MGMT;
