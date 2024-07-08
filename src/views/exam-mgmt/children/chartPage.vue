<script setup lang="ts">
  import { ref, provide, defineAsyncComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useFullscreen } from '@vueuse/core';
  import { type ExamListItem } from '@/api/exam';
  import {
    stuExamRankList,
    StuExamRank,
    stuProgressListApi,
    importantQustionsApi,
    focusStuApi,
    FocusStu,
    ProgressStu,
    ChartQuestion,
  } from '@/api/data';
  import { Message } from '@arco-design/web-vue';
  import { QuestionTypeConfigMap } from '@/views/question-mgmt/config';
  import { questionTypeMap } from '../config';

  // chart components
  const AutoScrollTable = defineAsyncComponent(() => import('@/components/customTable/autoScrollTable.vue'));
  const PassPieChart = defineAsyncComponent(() => import('../charts/passPie.vue'));
  const ScoreDistriChart = defineAsyncComponent(() => import('../charts/scoredistri.vue'));
  const DegreeChart = defineAsyncComponent(() => import('../charts/degree.vue'));
  const ClassScoreChart = defineAsyncComponent(() => import('../charts/classScore.vue'));

  // 传值
  const route = useRoute();
  const router = useRouter();
  const query = route.query as unknown as ExamListItem;
  /* 全屏逻辑 */
  const chartContainer = ref<HTMLElement | null>(null);
  const { isFullscreen, enter, exit, toggle: fullScreenToggle } = useFullscreen(chartContainer);

  /* 数据请求和处理 */
  // 学生成绩细则
  const stuScoreDetail = ref<StuExamRank[]>([]);
  const loadStuScoreList = () => {
    stuExamRankList({ page: 1, pageSize: 1000, id: +query.id })
      .then((res) => {
        const { list, total } = res.data;
        if (!total) {
          Message.warning('数据异常, 学生成绩缺失');
        }
        stuScoreDetail.value = list;
      })
      .finally(() => {});
  };

  const initPage = () => {
    loadStuScoreList();
    fullScreenToggle();
  };

  const back = () => {
    router.push({
      path: '/exam-mgmt/examDetail',
      query: route.query, // 和入口页面相同 query
    });
  };

  const tableListPageParams = { page: 1, pageSize: 3000 };
  initPage();
  provide('examInfo', query);
</script>

<template>
  <div
    ref="chartContainer"
    class="main wh-full"
  >
    <a-layout h="full">
      <a-layout-header
        flex="~ items-center justify-around relative"
        w="full"
        h="1/10"
        text-white
        bg="#1b2a5775"
      >
        <icon-left
          class="translate-x-15 cursor-pointer"
          :size="40"
          color="white"
          @click="back"
        />
        <div
          flex="~ col items-center justify-center"
          w="3/10"
        >
          <div m="b-2">
            <i
              i-tabler:book
              text="20px blue-5"
            />
            考试名称
          </div>
          <div
            text="18px"
            font="bold"
          >
            {{ query.name }} - {{ query.subject }}
          </div>
        </div>
        <div
          class="trapezoid"
          w="1/2"
          h="4/5"
          flex="~ items-center justify-center"
          text="3xl center"
          font="bold"
        >
          考试数据分析大屏
        </div>
        <div
          flex="~ col items-center justify-center"
          w="3/10"
        >
          <div m="b-2">
            <i
              i-tabler:clock
              text="20px blue-5"
            />
            考试时间
          </div>
          <div
            font="500"
            text="18px"
          >
            {{ new Date(+query.time).toISOString().slice(0, 10) }}
          </div>
        </div>
        <div class="-translate-x-15 cursor-pointer">
          <icon-fullscreen
            v-if="!isFullscreen"
            :size="30"
            :stroke-width="7"
            @click="enter"
          />
          <icon-fullscreen-exit
            v-else
            :size="30"
            :stroke-width="7"
            @click="exit"
          />
        </div>
      </a-layout-header>
      <a-layout-content
        w="full"
        h="full"
        p="y-1.5"
        flex="~ row justify-around"
      >
        <section
          w="11/40"
          h="9/10"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-5/16">
            <PassPieChart
              :pass-score="parseInt((query.total || 100) * 0.6 + '', 10)"
              :stu-score-list="stuScoreDetail"
            />
          </div>
          <div class="chartBox h-5/16">
            <ScoreDistriChart />
          </div>
          <div class="chartBox h-5/16">
            <AutoScrollTable
              title="重难点题目"
              :columns="[
                { name: '题序', dataIndex: 'order' },
                { name: '类型', dataIndex: 'type' },
                { name: '分值', dataIndex: 'score' },
                { name: '知识点', dataIndex: 'key' },
                { name: '得分率', dataIndex: 'rate' },
              ]"
              :load-api="importantQustionsApi"
              :request-params="{ id: +query.id, ...tableListPageParams }"
              :formart="
                (item: ChartQuestion) => {
                  item.rate = ((item.rate as number) * 100).toFixed(2) + '%';
                  // @ts-ignore
                  item.type = QuestionTypeConfigMap[item.type].label.slice(0, 2);
                }
              "
            />
          </div>
        </section>
        <section
          w="16/40"
          h="9/10"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-11/25">
            <DegreeChart
              :stu-score-list="stuScoreDetail"
              :pass-score="parseInt((query.total || 100) * 0.6 + '', 10)"
            />
          </div>
          <div class="chartBox h-13/25">
            <ClassScoreChart />
          </div>
        </section>
        <section
          w="11/40"
          h="9/10"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-5/16">
            <AutoScrollTable
              title="学生分数排名"
              :load-api="stuExamRankList"
              :columns="[
                { name: '名次', dataIndex: 'order' },
                { name: '姓名', dataIndex: 'name' },
                { name: '班级', dataIndex: 'className' },
                { name: '分数', dataIndex: 'score' },
              ]"
              :request-params="{ id: +query.id, ...tableListPageParams }"
              :formart="
                (item) => {
                  item.score = parseInt('' + item.score, 10);
                }
              "
            />
          </div>
          <div class="chartBox h-5/16">
            <AutoScrollTable
              title="学生进步排行"
              :load-api="stuProgressListApi"
              :columns="[
                { name: '姓名', dataIndex: 'name' },
                { name: '班级', dataIndex: 'className' },
                { name: '上一轮名次', dataIndex: 'last' },
                { name: '本轮名次', dataIndex: 'current' },
                { name: '进步系数', dataIndex: 'coefficient' },
              ]"
              :request-params="{ id: +query.id, subjectId: +query.subjectId, ...tableListPageParams }"
              :formart="
                (item: ProgressStu) => {
                  item.coefficient = (item.coefficient as number).toFixed(2);
                }
              "
            />
          </div>
          <div class="chartBox h-5/16">
            <AutoScrollTable
              title="重点关注学生"
              :load-api="focusStuApi"
              :columns="[
                { name: '姓名', dataIndex: 'name' },
                { name: '班级', dataIndex: 'className' },
                { name: '上一轮名次', dataIndex: 'last' },
                { name: '本轮名次', dataIndex: 'current' },
                { name: '退步系数', dataIndex: 'coefficient' },
              ]"
              :request-params="{ id: +query.id, subjectId: +query.subjectId, ...tableListPageParams }"
              :formart="
                (item: FocusStu) => {
                  item.coefficient = (item.coefficient as number).toFixed(2);
                }
              "
            />
          </div>
        </section>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
  .main {
    background-image: url('../../../assets/images/chartBg.png');
    background-size: cover;
    height: 100vh;
  }
  .chartBox {
    border: 2px solid #9ab2eb41;
    width: 100%;
    overflow: hidden;
    background-color: rgba(67, 135, 238, 0.068);
  }
</style>
