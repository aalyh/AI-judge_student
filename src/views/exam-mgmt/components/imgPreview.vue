<script lang="ts" setup>
  /**
   * a-image 组件自定义宽高受限，故包装一下
   */
  import { ref } from 'vue';

  const props = defineProps<{
    src: string;
    class?: string;
  }>();
  const visible = ref(false);
</script>

<template>
  <img
    v-bind="props"
    :class="`${props.class} cursor-pointer`"
    @click="visible = true"
  />
  <a-image-preview
    v-model:visible="visible"
    :src="props.src"
  />
</template>
