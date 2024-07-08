<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { QuestionListItem } from '@/api/question';
  import CustomTag from '@/components/tags/iconTag.vue';
  import DisplayLatex from '@/components/latex/index.vue';
  import { defineAsyncComponent, ref } from 'vue';
  import { QuestionTypeConfigMap, QuestionTypeEnum } from '../config';

  const ShortAnswerCfg = defineAsyncComponent(() => import('../components/shortAnswerCfg.vue'));
  const ChoiceAnswerCfg = defineAsyncComponent(() => import('../components/choiceAnswerCfg.vue'));
  // const BlankAnswerCfg = defineAsyncComponent(() => import('../components/blankAnswerCfg.vue'));
  type queryParams = Pick<QuestionListItem, 'id' | 'source' | 'type' | 'expectedDifficulty'>;
  const route = useRoute();
  const { id: problemId, source, type, expectedDifficulty } = route.query as unknown as queryParams;
</script>

<template>
  <a-layout class="h-[calc(100vh-60px-10px)] flex flex-col">
    <a-page-header
      style="background-color: var(--color-bg-2)"
      class="pageHeader"
      @back="$router.back()"
    >
      <template #title> 试题详情 </template>
      <template #subtitle>
        <div flex="~">
          <CustomTag
            :type="1"
            :value="source"
          />
          <CustomTag
            :type="3"
            :value="expectedDifficulty"
          />
        </div>
      </template>
    </a-page-header>
    <main class="w-1/1 flex-1 overflow-auto p-10 flex flex-col items-center justify-around">
      <section class="w-full h-12 flex items-center">
        <h1>{{ QuestionTypeConfigMap[type].label }} | 参考答案配置</h1>
      </section>

      <section class="flex-1 w-1/1 bg-blue-50">
        <ShortAnswerCfg
          v-if="+type === QuestionTypeEnum.shortAnswer"
          :problem-id="problemId"
        />
        <!-- <BlankAnswerCfg
          v-else-if="+type === QuestionTypeEnum.blank"
          :problem-id="problemId"
        /> -->
        <ChoiceAnswerCfg
          v-else-if="+type === QuestionTypeEnum.choice"
          :problem-id="problemId"
        />
      </section>
    </main>
  </a-layout>
</template>

<style scoped>
  :deep(.arco-scrollbar) {
    flex: 1;
  }
  /* 确保全屏模式下背景颜色正确 */
  * {
    background: Canvas;
  }
</style>
