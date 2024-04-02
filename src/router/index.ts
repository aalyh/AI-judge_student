import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// import Identify from "@/views/Indentity/index.vue";
import Layout from "@/layout/index.vue";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "identify",
    component: Layout,
  },
  {
    path: "/main",
    name: "layout",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          tab: "首页",
          index: 1,
          icon: "i-tabler:brand-google-home",
        },
      },
      {
        path: "/chat",
        name: "chat",
        component: () => import("@/views/chat/index.vue"),
        meta: {
          tab: "消息",
          index: 1,
          icon: "i-tabler:message-chatbot",
        },
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/user/index.vue"),
        meta: {
          tab: "个人中心",
          index: 1,
          icon: "i-tabler:user-pentagon",
        },
      },
    ],
  },
  {
    path: "/studyReport",
    name: "studyReport",
    component: () => import("@/views/studyReport/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404/index.vue"),
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

