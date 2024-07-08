<script lang="ts" setup>
  /**
   * 侧边折叠面板
   * arco未提供此组件，故实现之
   */
  import { ref, watch, onMounted } from 'vue';

  const collapse = ref(false);
  const el = ref<HTMLDivElement>();

  onMounted(() => {
    const e = el.value;
    if (!e) return;
    e.style.width = `${e.scrollWidth}px`;
  });

  watch(collapse, () => {
    const e = el.value;
    if (!e) return;
    if (collapse.value) {
      e.style.width = '0px';
    } else {
      e.style.width = `${e.scrollWidth}px`;
    }
  });
</script>

<template>
  <aside class="relative flex justify-between">
    <div
      ref="el"
      class="overflow-x-hidden transition-width"
    >
      <slot />
    </div>
    <a-divider direction="vertical" />
    <div class="absolute right-[-1px] top-[clamp(1rem,4rem,10%)]">
      <a-button
        shape="circle"
        type="dashed"
        size="small"
        class="scale-85 hover:scale-100"
        @click="collapse = !collapse"
      >
        <icon-right v-if="collapse" />
        <icon-left v-else />
      </a-button>
    </div>
  </aside>
</template>
