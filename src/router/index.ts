import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE, DEFAULT_LAYOUT } from './routes/base';
import createRouteGuard from './guard';
import formatModules from './routes';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DEFAULT_LAYOUT,
      redirect: '/dashboard/workplace',
      meta: {
        locale: '首页',
        hideChildrenInMenu: true,
        requiresAuth: false,
        icon: 'icon-dashboard',
        order: 0,
      },
      children: [
        {
          path: 'workplace',
          name: 'Workplace',
          component: () => import('@/views/dashboard/workplace/index.vue'),
          meta: {
            locale: '工作台',
            requiresAuth: false,
          },
        },
        // {
        //   path: 'personal-center',
        //   name: 'personal-center',
        //   component: () => import('@/views/personal-center/index.vue'), // TODO: replace me
        //   meta: {
        //     locale: '个人中心',
        //     requiresAuth: false,
        //   },
        // },
      ],
    },
    // @ts-ignore TODO: 下面这行处于调试目的，待权限系统完成可删
    ...formatModules(import.meta.glob('./routes/modules/*.ts', { eager: true }), []),
    // REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
