<script setup lang="ts">
  /**
   * 目前分数显示都取一位数精度  toFixed(1)
   */
  import { ref, provide } from 'vue';
  import mitt from 'mitt';
  import { PaperDetail } from '@/api/judge';
  import { Question } from '@/api/question';
  import { QuestionTypeConfigMap } from '@/views/question-mgmt/config';
  import SingleAnswer from './singleAnswer.vue';
  import collapsePanel from './collapsePanel.vue';

  const props = defineProps<{
    userId: number;
    examId: number;
    /**
     * 给定学生给定试卷，合成的试题信息和评分信息合成数组
     */
    compositePaper: Array<PaperDetail & Question>;
  }>();

  const types = Object.values(QuestionTypeConfigMap).map(
    ({ label: name, value: type }) => [name, props.compositePaper.filter((p) => p.type === type)] as const,
  );

  // [题目类型，题目][]

  // 注入事件监听器，通知子组件自身需要调用 el.scrollIntoView
  const scrollIntoViewEmitter = mitt();
  provide('scrollIntoViewEmitter', scrollIntoViewEmitter);

  // 当前题目信息
  const activeQuestionInfo = ref<{ order: number; type: number }>();
  const handleIsIntersecting = (e: { order: number; type: number }) => {
    activeQuestionInfo.value = e;
  };

  const isScolling = ref(false); // 作为屏蔽信号
  provide('isScolling', isScolling); // 要求已经滚动时，屏蔽子组件发出信号

  const onShouldScrollIntoView = (e: { type: number; order: number }) => {
    // 但注意由于需要确定第一个题目，此处使用 order 字段，而不是 problemId
    isScolling.value = true;
    activeQuestionInfo.value = e;
    scrollIntoViewEmitter.emit('scrollIntoView', e);
  };

  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  const onScroll = () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScolling.value = false; // 滚动已停止
    }, 200);
  };
</script>

<template>
  <!-- 导航区域 -->
  <aside>
    <collapse-panel class="h-full">
      <div class="min-w-[10rem] p-2 rounded mb-4 border-solid border-1 border-blue-100 bg-blue-50">
        <div class="font-thin text-xl text-gray">总分</div>
        <span>
          {{
            types
              .map(([name, questions]) => questions.reduce((acc, cur) => acc + cur.score, 0))
              .reduce((acc, cur) => acc + cur, 0)
              .toFixed(1)
          }}
        </span>
        <span class="text-xl font-thin mx-1">/</span>
        <span>
          {{
            types.map(([name, questions]) => questions.reduce((acc, cur) => acc + cur.totalScore, 0)).reduce((acc, cur) => acc + cur, 0)
          }}</span
        >
      </div>

      <template
        v-for="([name, problems], type) in types"
        :key="name"
      >
        <div v-if="problems.length > 0">
          <button
            class="w-full p-2 bg-zinc-50 hover:bg-zinc-100 transition-all rounded-lg cursor-pointer"
            border="solid 1 zinc-1"
            :style="{
              color: activeQuestionInfo?.type === type ? '#f1f5f9' : '',
              background: activeQuestionInfo?.type === type ? '#4080ff' : '',
            }"
            @click="onShouldScrollIntoView({ type, order: 1 })"
          >
            {{ name }}
          </button>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-2 my-2">
            <button
              v-for="{ order, problemId } in problems"
              :key="problemId"
              class="inline-block grid place-items-center p-2 bg-zinc-50 hover:bg-zinc-100 transition-all rounded-lg cursor-pointer"
              border="solid 1 zinc-1"
              text="center thin zinc-5"
              :style="{
                color: activeQuestionInfo?.order === order ? '#f1f5f9' : '',
                background: activeQuestionInfo?.order === order ? '#4080ff' : '',
              }"
              @click.stop="onShouldScrollIntoView({ type, order })"
            >
              {{ order }}
            </button>
          </div>
        </div>
      </template>
    </collapse-panel>
  </aside>

  <!-- 题目区域 -->

  <a-scrollbar
    class="h-full overflow-auto px-6"
    @scroll="onScroll"
  >
    <!-- TODO: 若实际上题目真的非常多再考虑虚拟列表 -->
    <template
      v-for="[name, questions] in types"
      :key="name"
    >
      <div v-if="questions.length > 0">
        <div class="px-4 pb-6 mb-8 bg-slate-100 rounded-2xl border-solid b-blue-100 b-1">
          <h1 class="font-normal">{{ name }}</h1>
          <a-typography class="flex gap-4">
            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >题目数：{{ questions.length }}</a-tag
            >

            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >得分：{{ questions.reduce((acc, cur) => acc + cur.score, 0).toFixed(1) }}</a-tag
            >
            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >总分：{{ questions.reduce((acc, cur) => acc + cur.totalScore, 0) }}</a-tag
            >
          </a-typography>
        </div>
        <single-answer
          v-for="question in questions"
          :key="question.problemId"
          :composite-question="question"
          @is-intersecting="handleIsIntersecting"
        />
      </div>
    </template>
  </a-scrollbar>
</template>
