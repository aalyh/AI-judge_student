<script lang="ts" setup>
  /**
   * 竖直方向折叠面板
   */
  import { ref, watch, onMounted } from 'vue';

  const collapse = ref(true); // 默认折叠
  const el = ref<HTMLDivElement>();

  onMounted(() => {
    const e = el.value;
    if (!e) return;
    e.style.height = collapse.value ? '0px' : `${e.scrollHeight}px`;
  });

  watch(collapse, () => {
    const e = el.value;
    if (!e) return;
    if (collapse.value) {
      e.style.height = '0px';
    } else {
      e.style.height = `${e.scrollHeight}px`;
    }
  });
</script>

<template>
  <a-button
    size="small"
    long
    @click="collapse = !collapse"
    >{{ collapse ? '展开' : '折叠' }}识别结果

    <template #icon>
      <icon-arrow-down v-if="collapse" />
      <icon-arrow-up v-else />
    </template>
  </a-button>
  <div
    ref="el"
    class="overflow-y-hidden transition-height pt-1 bg-slate-50"
  >
    <slot />
  </div>
</template>
