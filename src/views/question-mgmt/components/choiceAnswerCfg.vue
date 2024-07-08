<script setup lang="ts">
  import { ref } from 'vue';
  import { getAnswerListApi, createAnswerApi, updateAnswerApi, deleteAnswerApi, type AnswerItem } from '@/api/answer';
  import { getQuestionDetail } from '@/api/question';
  import useLoading from '@/hooks/loading';
  import DisplayLatex from '@/components/latex/index.vue';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps<{
    problemId: number;
  }>();

  const { loading: questionLoading, setLoading: setQuestionLoading } = useLoading(true);
  const answer = ref<AnswerItem | null>(null);
  const answerCache = ref('');
  const isEdit = ref(false);
  const content = ref('');

  const getList = () => {
    setQuestionLoading(true);
    getAnswerListApi(props.problemId)
      .then(({ success, data }) => {
        if (success) {
          const { list } = data;
          answer.value = (list || []).length ? list[0] : null;
          answerCache.value = answer.value?.answer || '';
          isEdit.value = !answer.value;
          isEdit.value = false;
        }
      })
      .finally(() => {
        setQuestionLoading(false);
      });
  };

  const getProblem = () => {
    getQuestionDetail(+props.problemId).then(({ success, data }) => {
      if (success) {
        const { title } = data;
        content.value = title;
        getList();
      }
    });
  };

  const submit = () => {
    if (!answerCache.value) {
      Message.warning('请先选择答案');
    }
    setQuestionLoading(true);
    const submitFn = answer.value ? updateAnswerApi : createAnswerApi;
    const data = answer.value ? { ...answer.value, answer: answerCache.value } : { problemId: props.problemId, answer: answerCache.value };
    // @ts-ignore
    submitFn(data)
      .then(({ success }) => {
        if (success) {
          Message.success('答案更新成功');
          getList();
        }
      })
      .finally(() => {
        setQuestionLoading(false);
      });
  };

  const EditAnswer = () => {
    isEdit.value = true;
  };

  const answerList = ['A', 'B', 'C', 'D'];

  const setAnswer = (answer: string) => {
    if (isEdit.value) {
      answerCache.value = answer;
    }
  };
  const quit = () => {
    setAnswer(answer.value?.answer || '');
    isEdit.value = false;
  };

  const setupComp = () => {
    getProblem();
  };

  setupComp();
</script>

<template>
  <div class="">
    <a-spin
      :loading="questionLoading"
      tip="答案加载中, 请稍后..."
      class="wh-full inline-flex wh-full items-center flex-col justify-start"
    >
      <div class="w-full h-auto p-10 text-1.4em font-600 text-gray-600 line-height-loose">
        <DisplayLatex :latex="content" />
      </div>

      <div
        flex="~ row justify-around items-center"
        class="w-2/5 mb-20"
      >
        <div
          v-for="item in answerList"
          :key="item"
          :class="{
            'rightAnswer': answerCache === item,
            'cursor-pointer': isEdit,
          }"
          class="text-3em font-bold text-gray-800 p-10"
          @click="setAnswer(item)"
        >
          {{ item }}
        </div>
      </div>

      <div>
        <a-button
          v-if="!isEdit"
          type="primary"
          @click="EditAnswer"
        >
          修改答案
        </a-button>
        <a-button
          v-else
          type="primary"
          status="warning"
          @click="submit"
        >
          提交新答案
        </a-button>
        <a-button
          v-if="isEdit"
          class="ml-8"
          @click="quit"
          >取消</a-button
        >
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
  .rightAnswer::after {
    display: block;
    content: '√';
    font-size: 3em;
    font-weight: bold;
    color: #50e98b;
    position: absolute;
    transform: translate(-20%, -50%);
  }

  .inline-flex.inline-flex {
    display: inline-flex;
  }
</style>
