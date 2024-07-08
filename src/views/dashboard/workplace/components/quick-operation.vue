<template>
  <a-card
    class="general-card"
    title="快捷入口"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #extra>
      <a-link>管理</a-link>
    </template>
    <a-row :gutter="8">
      <a-col
        v-for="link in links"
        :key="link.text"
        :span="8"
        class="wrapper"
      >
        <div class="icon">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text">
          {{ link.text }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <a-divider
      class="split-line"
      style="margin: 0"
    />
  </a-card>
</template>

<script lang="ts" setup>
  const links = [
    { text: '班级列表', icon: 'icon-file' },
    { text: '教师列表', icon: 'icon-storage' },
    { text: '考试列表', icon: 'icon-settings' },
  ];
</script>

<style scoped lang="less"></style>
