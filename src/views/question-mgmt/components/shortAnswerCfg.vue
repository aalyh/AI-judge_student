<script setup lang="ts">
  import { getAnswerListApi, createAnswerApi, type AnswerItem } from '@/api/answer';
  import { getQuestionDetail } from '@/api/question';
  import useLoading from '@/hooks/loading';
  import DisplayLatex from '@/components/latex/index.vue';
  import { Message } from '@arco-design/web-vue';
  import { defineAsyncComponent, ref } from 'vue';

  const props = defineProps<{
    problemId: number;
  }>();

  const SingleAnswer = defineAsyncComponent(() => import('./singleShortAnswer.vue'));
  const { loading: questionLoading, setLoading: setQuestionLoading } = useLoading(true);
  const answerList = ref<AnswerItem[]>([]);
  const answerTotal = ref(0);
  const answerCache = ref('');
  const isEdit = ref(false);
  const setEdit = (state: boolean) => {
    isEdit.value = state;
  };
  const content = ref('');

  const setAnswer = (answer: string) => {
    answerCache.value = answer || '';
  };

  const appendNewAnswer = ref(false);
  const setAppendNewAnswer = (state: boolean) => {
    appendNewAnswer.value = state;
  };

  const handleAppendNew = () => {
    if (!appendNewAnswer.value) {
      setAppendNewAnswer(true);
      setEdit(true);
      return;
    }

    answerCache.value = '';
    setEdit(false);
    setAppendNewAnswer(false);
  };

  const getList = () => {
    setQuestionLoading(true);
    getAnswerListApi(props.problemId)
      .then(({ success, data }) => {
        if (success) {
          const { list, total } = data;
          answerList.value = list;
          answerTotal.value = total;
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
    if (!isEdit.value) {
      isEdit.value = true;
      return;
    }
    if (!answerCache.value) {
      Message.warning('请先选择答案');
      return;
    }
    setQuestionLoading(true);
    const data = { problemId: +props.problemId, answer: answerCache.value };
    createAnswerApi(data)
      .then(({ success }) => {
        if (success) {
          Message.success('答案创建成功');
          setEdit(false);
          setAnswer('');
          setAppendNewAnswer(false);
          getList();
        }
      })
      .finally(() => {
        setQuestionLoading(false);
      });
  };

  const quit = () => {
    setAnswer('');
    isEdit.value = false;
    setAppendNewAnswer(false);
  };

  const handleAnswerChange = (newAnswer: string, index: number) => {
    answerList.value[index].answer = newAnswer;
  };
  const handleAnswerRemove = (deletedIndex: number) => {
    answerList.value.splice(deletedIndex, 1);
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
      class="wh-full flex wh-full items-center flex-col justify-start"
    >
      <div class="w-full h-auto p-10 text-1.4em font-600 text-gray-600 line-height-loose">
        <DisplayLatex :latex="content" />
      </div>

      <section class="w-full h-12 flex items-center mt-10 mb-10">
        <h1><i class="i-tabler:analyze mr-2"></i>参考答案</h1>
      </section>
      <div class="w-full mb-10 px-3">
        <a-button
          v-if="answerList && answerList.length"
          :type="appendNewAnswer ? 'secondary' : 'primary'"
          class="text-center text-1.2em"
          @click="handleAppendNew"
        >
          <div v-show="!appendNewAnswer"> <i class="i-tabler:text-plus text-1.3em mr-2"></i> 新增 </div>
          <div v-show="appendNewAnswer">取消</div>
        </a-button>
      </div>

      <section
        v-if="!(answerList && answerList.length) || appendNewAnswer"
        class="flex flex-col items-center"
      >
        <div class="text-gray-400">
          <h2 v-if="!(answerList && answerList.length) && !isEdit">暂无参考答案, 开始配置</h2>
          <a-textarea
            v-else
            v-model="answerCache"
            placeholder="编辑参考答案内容"
            allow-clear
            :auto-size="{ minRows: 5 }"
            class="min-w-80vw text-1.2em line-height-2 font-600"
          />
        </div>
        <div class="mt-10">
          <a-button
            type="primary"
            :status="isEdit ? 'warning' : 'normal'"
            @click="submit"
          >
            {{ isEdit ? '提交答案' : '新建答案' }}
          </a-button>
          <a-button
            v-if="isEdit"
            class="ml-8"
            @click="quit"
          >
            取消
          </a-button>
        </div>
      </section>

      <template v-if="answerList && answerList.length">
        <div
          v-for="(item, index) in answerList"
          :key="item.id"
          class="w-1/1"
        >
          <SingleAnswer
            :answer-item="item"
            :index="index"
            @on-success="handleAnswerChange"
            @on-remove="handleAnswerRemove"
          />
        </div>
      </template>
    </a-spin>
  </div>
</template>

<style scoped lang="less">
  .rightAnswer::after {
    display: block;
    content: '√';
    font-size: 3em;
    font-weight: bold;
    color: #50e98b;
    position: absolute;
    transform: translate(-20%, -50%);
  }
  :deep(.arco-textarea) {
    font-size: 1.4em;
    line-height: 2;
    font-weight: 600;
  }
</style>
