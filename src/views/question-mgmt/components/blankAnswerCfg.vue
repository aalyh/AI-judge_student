<script setup lang="ts">
  import { getAnswerListApi, createAnswerApi, updateAnswerApi, deleteAnswerApi, type AnswerItem } from '@/api/answer';

  const props = defineProps<{
    problemId: number;
  }>();
</script>

<template>
  <div></div>
</template>
