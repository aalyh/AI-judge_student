<script setup lang="ts" name="layout">
import { RouteRecordRaw, useRoute } from "vue-router";
import { routes } from "@/router";
import { deviceStoreType } from "@/main";
const { deviceHeight } = inject("$deviceStore") as deviceStoreType;
const routerController = useRouter();
const route = useRoute();

/* 类型定义区 */

interface tabbarItem {
  path: string;
  name: string;
  icon: string;
}

/* 类型定义区 */

/* 数据获取区 */
const getTabbar = (): Array<tabbarItem> => {
  return routes[1].children!.map((route: RouteRecordRaw) => {
    const { path, meta } = route;
    return {
      path,
      name: meta?.tab as string,
      icon: meta?.icon as string,
    };
  });
};
/* 数据获取区 */

/* 逻辑区 */
const tabbar = ref<Array<tabbarItem>>(getTabbar());
const changeTab = (targetPath: string): void => {
  routerController.push({ path: targetPath });
};

/* 逻辑区 */
</script>

<template>
  <div
    flex="~ col justify-between items-center"
    class="w-full"
    :style="{ height: deviceHeight + 'px' }"
  >
    <main flex="~ 1 f-col justify-between items-start" w=" full">
      <router-view />
    </main>
    <footer
      style="padding-top: 0.6rem; padding-bottom: 0.3rem"
      border=" t-[1px] solid x-0 b-0 coolGray-300"
      flex="~ row justify-around items-center"
      class="w-full m-0"
    >
      <div
        class="text-center transition-none"
        v-for="(item, index) in tabbar"
        @click.stop="changeTab(item.path)"
        :class="route.path == item.path ? ' text-teal-400' : ''"
        :key="index"
      >
        <div :class="item.icon" text=" xl"></div>
        <div text=" sm">{{ item.name }}</div>
      </div>
    </footer>
  </div>
</template>

