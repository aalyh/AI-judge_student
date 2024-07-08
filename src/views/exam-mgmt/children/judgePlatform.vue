<script setup lang="ts">
  /**
   * 阅卷界面必须query参数：examId
   * userId 现在自动获取
   * BUG：评语的 pop-confirm 定位有问题，属于 arco 的实现问题
   */
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useFullscreen } from '@vueuse/core';
  import { ExamListItem, getProblemList } from '@/api/exam';
  import { Notification } from '@arco-design/web-vue';
  import { PaperDetail, getPaperDetail, getReview, reviewFulfil, submitJudgeRes } from '@/api/judge';
  import { Question } from '@/api/question';
  import useLoading from '@/hooks/loading';
  import SinglePaper from '../components/singlePaper.vue';
  import ActionButton from '../components/actionButton.vue';

  const router = useRouter();
  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
  const examId = Number(query.id); // 父页面提供
  const userIdRef = ref<number>(); // 需要请求得到

  const el = ref<HTMLElement | null>(null);
  const { isFullscreen, toggle, exit: exitFullscreen } = useFullscreen(el);
  /** 需求请求多个接口，请求时展示loading */
  const loadingDataStatus = ref<'loading' | 'success' | 'error'>('loading');
  type ComposedData = PaperDetail & Question;
  const compositePaper = ref<ComposedData[]>();
  const error = ref<Error>();
  const reviewIds = ref<number[]>(); // state=2
  const reviewDoneIds = ref<number[]>(); // state=3
  const submitModalVisible = ref(false);

  const loadNextUser = async () => {
    loadingDataStatus.value = 'loading';
    try {
      // 页面进入时，加载数据
      const { list } = (await getReview({ state: 2, examId, pageSize: 9999 })).data;
      reviewIds.value = list;
      const [userId] = list; // 获取第一个考生
      if (!userId) {
        throw new Error('已全部阅卷完毕！完成当前考试组所有考试阅卷后，请前往考试组管理，提交本考试组阅卷结果, 生成学生端数据');
      }
      userIdRef.value = userId;
      reviewDoneIds.value = (await getReview({ state: 3, examId, pageSize: 9999 })).data.list;

      const problems = (await getProblemList(examId)).data.list;
      const thisUserPaperDetail = (
        await getPaperDetail({
          examId,
          userId,
          current: 0,
          pageSize: 9999, // get all questions, do not paging it
        })
      ).data.list;

      const wipComposedData: ComposedData[] = [];
      thisUserPaperDetail.forEach((detail) => {
        //! 重要：注意：如果 problem === undefined 那必然是数据库有一些问题
        // 此处暂未做处理
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const problem = problems.find((p) => p.problemId === detail.problemId)!;

        wipComposedData.push(Object.assign(problem, detail));
      });
      compositePaper.value = wipComposedData;
      // done
      loadingDataStatus.value = 'success';
      submitModalVisible.value = false;
    } catch (e) {
      // for debug
      // eslint-disable-next-line no-console
      error.value = e as Error;
      loadingDataStatus.value = 'error';
    }
  };

  onMounted(loadNextUser);

  const back = () => {
    router.push({
      path: '/exam-mgmt/examDetail',
      query: route.query, // 和入口页面相同 query
    });
  };

  const submitThis = async () => {
    // exitFullscreen(); // 退出全屏，因为modal挂载点有问题
    const ok = await reviewFulfil({ userId: userIdRef.value!, examId });
    if (ok) submitModalVisible.value = true;
    reviewIds.value = (await getReview({ state: 2, examId, pageSize: 9999 })).data.list;
  };
  const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading(false);
  const handleSubmitModal = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ids = reviewIds.value!;
    if (ids.length > 0) {
      // 切换到下一个 userId
      loadNextUser();
      submitModalVisible.value = false;
    } else {
      // 对考试的submit
      setSubmitLoading(true);
      const res = await submitJudgeRes(examId);
      if (res.success) {
        Notification.success('本堂考试阅卷信息已全部提交, 即将回到详情页。数据分析大屏、本堂考试专属AI小助理已开放');
        setTimeout(() => {
          back();
        }, 3000);
        submitModalVisible.value = false;
      }

      setSubmitLoading(false);
    }
  };
</script>

<template>
  <!-- id 确保全屏模式挂载点正确 -->
  <a-layout
    id="id-for-judge-container"
    ref="el"
  >
    <a-page-header @back="back">
      <template #title> {{ query.name }}&nbsp;{{ query.subject }} </template>
      <template #subtitle>
        {{ new Date(Number(query.time)).toISOString().slice(0, 10) }}（{{ (query.timeLimit - query.time) / (1000 * 60) }}分钟）
      </template>

      <template #extra>
        <a-space>
          <a-progress
            v-if="reviewIds && reviewDoneIds && loadingDataStatus === 'success'"
            class="w-full min-w-[16rem] mr-4"
            :percent="reviewDoneIds.length / +query.number!!"
          >
            <template #text="scope">
              <span
                :title="`${(scope.percent * 100).toFixed(1)}%`"
                class="cursor-help"
              >
                阅卷进度 {{ reviewDoneIds.length }}/{{ +query.number!! }}</span
              >
            </template>
          </a-progress>
          <a-button
            v-if="loadingDataStatus === 'success'"
            type="primary"
            @click="toggle"
            >{{ isFullscreen ? '退出全屏' : '全屏阅卷' }}</a-button
          >
          <action-button
            v-if="loadingDataStatus === 'success'"
            type="outline"
            @action="submitThis"
            >提交阅卷结果</action-button
          >
          <a-modal
            v-model:visible="submitModalVisible"
            :render-to-body="false"
            popup-container="id-for-judge-container"
            width="auto"
            :mask-closable="false"
            :esc-to-close="false"
            :on-before-ok="handleSubmitModal"
            :ok-loading="submitLoading"
            @cancel="submitModalVisible = false"
          >
            <template #title>提交成功</template>
            <div v-if="reviewIds && reviewIds.length > 0">提交成功，是否转到下一张试卷？</div>
            <div v-else>
              <span>已评阅完成所有试卷，单击确定返回上一级页面。</span>
              <br />
              <strong>注意：完成当前考试组所有考试阅卷后，请前往考试组管理，提交本考试组阅卷结果, 生成学生端数据</strong>
            </div>
          </a-modal>
        </a-space>
      </template>
    </a-page-header>

    <div :class="`flex px-2 bg-white rounded-lg relative ${isFullscreen ? 'h-92vh' : 'max-h-[calc(92vh-50px)]'}`">
      <div
        v-if="loadingDataStatus === 'loading'"
        class="wh-full"
      >
        <a-spin
          tip="试卷正在加载中..."
          class="w-full my-[20vh]"
        />
      </div>
      <template v-else-if="loadingDataStatus === 'success'">
        <SinglePaper
          :exam-id="examId"
          :user-id="userIdRef!"
          :composite-paper="compositePaper!"
        />
      </template>
      <div
        v-else-if="loadingDataStatus === 'error'"
        class="w-full py-[10vh]"
      >
        <a-result
          status="error"
          :title="error?.name"
        >
          <template #subtitle>{{ error?.message }}</template>
          <template #extra>
            <a-space>
              <a-button
                type="primary"
                @click="back"
                >返回上一页</a-button
              >
            </a-space>
          </template>
        </a-result>
      </div>
    </div>
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

  #id-for-judge-container {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>
