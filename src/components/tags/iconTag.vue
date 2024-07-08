<script setup lang="ts">
  import { ref } from 'vue';

  enum TagType {
    source = 1,
    maxScore = 2,
    expectedDifficulty = 3,
  }
  interface TagTypeConfig {
    icon: string;
    text: string;
    color: string;
  }
  type TagTypeMap = {
    [key in TagType]: TagTypeConfig;
  };
  const props = defineProps<{
    type: TagType;
    value: any;
  }>();
  const tagMap = ref<TagTypeMap>({
    [TagType.source]: {
      icon: 'i-tabler:world-search',
      text: `来源: ${props.value}`,
      color: 'arcoblue',
    },
    [TagType.maxScore]: {
      icon: 'i-tabler-discount-check-filled',
      color: `${(+props.value as number) < 10 ? 'orangered' : '#0fc6c2'}`,
      text: `满分: ${props.value}分`,
    },
    [TagType.expectedDifficulty]: {
      icon: 'i-tabler:brand-snowflake',
      text: `难度系数: ${props.value}`,
      color: 'purple',
    },
  });
</script>

<template>
  <a-tag
    :color="tagMap[props.type].color"
    class="infoTag"
  >
    <i
      :class="tagMap[props.type].icon"
      class="mr-1"
    ></i>
    {{ tagMap[props.type].text }}
  </a-tag>
</template>

<style scoped>
  .infoTag {
    display: flex;
    align-items: center;
    width: min-content;
    margin-top: 0.25rem;
    font-size: 1.1em;
    font-weight: bold;
    border-radius: 0.4rem;
    margin-right: 6px;
  }
</style>
