<template>
  <div class="container">
    <div class="bg-white h-30vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">全科总分</van-col>
      </van-row>
      <van-row style="border-bottom: 1px solid #111">
        <van-col span="12" style="line-height: 3.5rem"
          ><span class="text-size-13">{{ props.data }}</span
          ><span>分</span></van-col
        >
        <van-col span="12" style="line-height: 4.5rem" class="text-#979797"
          ><span>满分750分</span></van-col
        >
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">语文：0/150</van-col>
        <van-col span="12">数学：28/150</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">英语：0/150</van-col>
        <van-col span="12">理综：0/300</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">物理：0/110</van-col>
        <van-col span="12">化学：0/100</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">生物：0/90</van-col>
      </van-row>
    </div>
    <div class="bg-white h-50vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">历次成绩变化</van-col>
      </van-row>
      <van-row>
        <van-col span="8">
          <van-tabs v-model:active="activeName">
            <van-tab title="班级排名" name="a">
              <div
                class="w-full h-full"
                id="chartContainer"
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
<script setup lang="ts">
import * as echarts from "echarts";
import { getTrendAll } from "@/api/exam";
import formatTime from "@/utils/common/timeFormat";
type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
  key?: string;
};
const props = defineProps<{
  data: string;
}>();
interface trend {
  classOrder: number;
  name: string;
  order: number;
  score: number;
  time: number;
}
const activeName = ref("a");
const pagination = reactive<Paging>({
  page: 1,
  pageSize: 10,
});
const list = ref<trend[]>();
const score: number[] = [];
const time: string[] = [];
let option;

function initChart() {
  let chartDom = document.getElementById("chartContainer");
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
  getTrendAll(pagination).then((res) => {
    console.log(res);
    list.value = res.data.list;
    res.data.list.forEach((element: trend) => {
      console.log(element.score, formatTime(element.time));
      score.push(Number(element.score.toFixed(2)));
      time.push(formatTime(element.time));
    });
    console.log(score, time);
  });
  // console.log(score.value, time.value);
}
setTimeout(() => {
  initChart();
}, 1500);
loadTrend();
</script>
<style scoped>
.van-tabs__content #chartContainer {
  width: 90vw;
  height: 40vh;
}
</style>
