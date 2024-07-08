<script setup lang="ts">
  /**
   * 单个试题
   */

  import { ref, inject, onMounted, onUnmounted, Ref } from 'vue';
  import { Notification } from '@arco-design/web-vue';
  import { Emitter } from 'mitt';
  import { useIntersectionObserver } from '@vueuse/core';
  import { PaperDetail, updateJudge } from '@/api/judge';
  import { Question } from '@/api/question';
  import DisplayLatex from '@/components/latex/index.vue';
  import { debounce } from 'lodash';
  import ActionButton from './actionButton.vue';
  import ImgPreview from './imgPreview.vue';
  import CollapseVertical from './collapseVertical.vue';

  const props = defineProps<{
    compositeQuestion: PaperDetail & Question;
    /** 滚动当前元素到视窗顶部 */
  }>();
  const question = props.compositeQuestion;

  const emit = defineEmits<{
    isIntersecting: [{ id: number; order: number; type: number }];
  }>();

  // 以下代码处理 scrollIntoView
  const isScolling = inject('isScolling') as Ref<boolean>;
  const el = ref<HTMLElement>();
  const fnScrollIntoView = () => {
    el.value?.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
  };
  defineExpose({ scrollIntoView: fnScrollIntoView }); // 暂时备用
  const scrollIntoViewEmitter = inject('scrollIntoViewEmitter') as Emitter<{ scrollIntoView: { type: number; order: number } }>;
  const handleSscrollIntoViewEvent = ({ type, order }: { type: number; order: number }) => {
    if (type === question.type && order === question.order) {
      fnScrollIntoView();
    }
  };
  onMounted(() => scrollIntoViewEmitter.on('scrollIntoView', handleSscrollIntoViewEvent));
  onUnmounted(() => scrollIntoViewEmitter.off('scrollIntoView', handleSscrollIntoViewEvent));

  // 通知当前组件已进入视图
  useIntersectionObserver(
    el,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !isScolling.value) {
        emit('isIntersecting', question);
      }
    },
    {
      // threshold: 0, // into view from bottom
    },
  );

  // 修改数据
  const toFixed = (n: number) => Number(n.toFixed(1));
  const modifiedResult = ref(question.result);
  const modifiedScore = ref(toFixed(question.score));

  // 为了方便，直接在子组件中修改父组件传入的对象数据
  // 因此，注意此时父子组件是需要耦合的
  const handleModifyResult = async () => {
    const res = await updateJudge({ id: question.id, result: modifiedResult.value });
    if (res.success) {
      Notification.success('试题得分修改成功');
      question.result = modifiedResult.value;
      question.checked = true; // 已修改过
    } else {
      Notification.error('试题得分修改失败');
    }
  };
  const handleModifyScore = async () => {
    const res = await updateJudge({ id: question.id, score: modifiedScore.value });
    if (!res.success) throw new Error('失败');
    question.score = modifiedScore.value;
  };

  const popupContainer = document.getElementById('id-for-judge-container')!;
</script>

<template>
  <section
    ref="el"
    class="relative [&_*]:max-w-full"
  >
    <div class="flex justify-between items-start gap-4 mb-4">
      <!-- left: the question area -->
      <div class="flex-1 grid">
        <!-- 题目 -->
        <div class="flex gap-2 items-start mb-2">
          <small class="bg-gray-200 text-center aspect-1/1 h-1.3rem line-height-1.3rem align-middle rounded-lg select-none mt-1">
            {{ question.order }}
          </small>
          <h3 class="my-1">
            <display-latex :latex="question.title" />
          </h3>
        </div>

        <!-- 内容 -->
        <div class="px-1">
          <img-preview
            v-if="question.url"
            :src="question.url"
            class="max-h-50vh"
          />

          <div class="my-2">
            <collapse-vertical v-if="question.url && question.studentAnswer">
              <display-latex :latex="question.studentAnswer" />
            </collapse-vertical>
            <a-typography-paragraph
              v-else-if="!question.studentAnswer"
              type="warning"
              >{{ '<未作答>' }}
            </a-typography-paragraph>
            <display-latex
              v-else
              :latex="question.studentAnswer"
            />
          </div>
        </div>

        <a-typography class="relative group">
          <a-typography-paragraph
            blockquote
            class="transition group-hover:bg-stone-50 cursor-pointer"
          >
            <div class="my-1 flex items-center gap-3">
              <strong>评语</strong>
              <a-tag
                v-if="!question.checked && question.result"
                size="small"
                color="#0fc6c2"
                >AI</a-tag
              >
            </div>
            <a-typography-paragraph :type="question.result ? '' : 'warning'">
              <display-latex
                v-if="question.result"
                :latex="question.result"
              />
              <template v-else>{{ '<无>' }}</template>
            </a-typography-paragraph>
          </a-typography-paragraph>
          <a-popconfirm
            :popup-container="popupContainer"
            position="lt"
            @before-ok="handleModifyResult"
          >
            <template #icon>
              <div class="flex flex-col translate-y-10">
                <small
                  v-for="(char, i) in `修改评语`"
                  :key="i"
                  >{{ char }}</small
                >
              </div>
            </template>

            <template #content>
              <a-textarea
                v-model="modifiedResult"
                :placeholder="`修改第${question.order}题的评语`"
                allow-clear
                :auto-size="{ minRows: 5, maxRows: 20 }"
                class="min-w-40vw"
              />
            </template>
            <a-button
              type="text"
              class="absolute inset-[4px_0_auto_auto] transition opacity-0 group-hover:opacity-100"
              @click="handleModifyScore"
              >修改评语
            </a-button>
          </a-popconfirm>
        </a-typography>
      </div>

      <!-- right: the operation panel -->
      <div class="sticky top-1">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="font-thin text-xl text-gray">本题得分</div>

          <div class="flex justify-around items-center text-2xl">
            <span>{{ question.score.toFixed(1) }}</span>
            <span class="text-4xl font-thin">/</span>
            <span>{{ question.totalScore.toFixed(1) }}</span>
          </div>
        </div>
        <div class="grid mt-4">
          <a-input-number
            v-model="modifiedScore"
            class="max-w-108px"
            placeholder="请输入..."
            mode="button"
            :min="0"
            :max="question.totalScore"
          />
          <action-button
            status="warning"
            :disabled="modifiedScore === question.score"
            @action="handleModifyScore"
          >
            修改得分
          </action-button>
        </div>
      </div>
    </div>
    <a-divider></a-divider>
  </section>
</template>

<style scoped>
  :deep(img) {
    max-width: 100%;
  }
</style>
