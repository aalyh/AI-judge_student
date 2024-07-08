<script setup lang="ts">
  import { defineAsyncComponent, ref } from 'vue';

  const props = defineProps<{
    examId: number;
    subjectId: number;
    subject: string;
  }>();
  const emits = defineEmits<{
    (e: 'onSuccess'): void;
    (e: 'onClose'): void;
  }>();

  const SearchSelectQuestion = defineAsyncComponent(() => import('./searchSelectQuestion.vue'));
  // 题目替换逻辑
  const exchangePopconfirmVisible = ref(false);
  const setExchangeConfirmVisible = (visible: boolean) => {
    exchangePopconfirmVisible.value = visible;
  };
  const exchangeQuestion = () => {
    setExchangeConfirmVisible(false);
    emits('onClose');
  };
  const handleExchange = () => {
    setExchangeConfirmVisible(false);
    emits('onSuccess');
  };
</script>

<template>
  <a-popconfirm
    v-model:popup-visible="exchangePopconfirmVisible"
    :blur-to-close="false"
    :click-outside-to-close="false"
    class="h-auto"
    position="lb"
    @cancel="exchangeQuestion"
    @ok="exchangeQuestion"
  >
    <a-button
      type="text"
      status="warning"
      class="mr-2"
      @click="setExchangeConfirmVisible(true)"
    >
      <icon-translate
        :stroke-width="6"
        size="18"
        class="mr-1"
      />
      手动添加试题
    </a-button>
    <template #content>
      <SearchSelectQuestion
        :subject-id="+props.subjectId"
        :subject="props.subject"
        :exam-id="props.examId"
        @on-exchange="handleExchange"
      />
    </template>
  </a-popconfirm>
</template>

<style scoped lang="less">
  :deep(.arco-popconfirm-icon) {
    display: none !important;
  }
</style>
