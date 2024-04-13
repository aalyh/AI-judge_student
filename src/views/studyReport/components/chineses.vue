<script setup lang="ts">
import * as echarts from "echarts";
import { getTrend, getAnswersheet } from "@/api/exam";
import formatTime from "@/utils/common/timeFormat";
import { subject } from "../index.vue";
type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
  subjectId: number | undefined;
};
interface trend {
  classOrder: number;
  name: string;
  order: number;
  score: number;
  time: number;
}
const props = defineProps<{
  data: subject | undefined;
}>();

const activeName = ref("a");
const pagination = reactive<Paging>({
  page: 1,
  pageSize: 10,
  subjectId: props.data?.subjectId,
});
const list = ref<trend[]>();
const score: number[] = [];
const time: string[] = [];
let option;

function initChart() {
  let chartDom = document.getElementById("chineseChartContainer");
  let myChart = echarts.init(chartDom);
  option = {
    xAxis: {
      type: "category",
      data: time,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: score,
        type: "line",
      },
    ],
  };
  console.log(chartDom);

  option && myChart.setOption(option);
}
function loadTrend() {
  getTrend(pagination).then((res) => {
    console.log(res);
    list.value = res.data.list;
    res.data.list.forEach((element: trend) => {
      // console.log(element.score, formatTime(element.time));
      score.push(Number(element.score.toFixed(2)));
      time.push(formatTime(element.time));
    });
  });
  getAnswersheet(props.data?.examId as number).then((res) => {
    console.log(res, "阅卷结果");
  });
  // console.log(score.value, time.value);
}
setTimeout(() => {
  initChart();
}, 2000);
loadTrend();
</script>
<template>
  <div class="container">
    <div class="bg-white h-15vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">{{ props.data?.name || "语文" }}</van-col>
      </van-row>
      <van-row>
        <van-col span="12" style="line-height: 3.5rem"
          ><span class="text-size-13">{{
            props.data?.score.toFixed(2) || "-"
          }}</span
          ><span>分</span></van-col
        >
        <van-col span="12" style="line-height: 4.5rem" class="text-#979797"
          ><span>满分{{ props.data?.total || 100 }}分</span></van-col
        >
      </van-row>
    </div>
    <div class="bg-white h-60vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">历次成绩变化</van-col>
      </van-row>
      <van-row>
        <van-col span="8">
          <van-tabs v-model:active="activeName">
            <van-tab title="班级排名" name="a">
              <div
                class="w-full h-full"
                id="chineseChartContainer"
                v-show="list?.length !== 0"
              ></div>
              <div class="w-full h-full" v-show="list?.length === 0">
                暂无数据
              </div>
            </van-tab>
          </van-tabs>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style scoped>
.van-tabs__content #chineseChartContainer {
  width: 90vw;
  height: 40vh;
}
</style>
