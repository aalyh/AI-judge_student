<script setup lang="ts">
  /**
   * @author liushi_21
   * @see https://arco.design/vue/component/tree
   */
  import { ref } from 'vue';
  import useTreeStore from '@/store/modules/tree/index';

  const { permissionTree } = useTreeStore();
</script>

<template>
  <a-layout class="h-full">
    <a-layout-sider
      class="p2"
      :width="350"
    >
      <header class="p2">
        <a-input-search placeholder="搜索权限" />
        <a-tree
          size="large"
          :default-expand-all="false"
          :data="permissionTree"
          :show-line="true"
        />
      </header>
      <!-- TODO:tree -->
    </a-layout-sider>
    <a-layout-content>
      <a-card class="h-full">
        <header class="flex gap-4">
          <a-button type="primary">关联角色</a-button>
          <a-button>关联用户</a-button>
        </header>
        <!-- TODO:table -->
      </a-card>
    </a-layout-content>
  </a-layout>
</template>
