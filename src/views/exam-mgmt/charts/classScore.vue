<script setup lang="ts">
  import { ref, inject } from 'vue';
  import { classScoreApi, type ClassScore } from '@/api/data';
  import { type ExamListItem } from '@/api/exam';
  import { getSpecificValueArr } from '@/utils/arrayHelper';
  import BaseChart from '@/components/chart/index.vue';
  import { getYsilderOpt } from './opts';

  const examInfo = inject('examInfo');
  const { id } = examInfo as ExamListItem;
  const chartOpt = ref({});
  const getOpt = (data: ClassScore[]) => {
    const avgList = getSpecificValueArr(data, 'average', (num) => +num.toFixed(2));
    const midList = getSpecificValueArr(data, 'mid', (num) => +num.toFixed(2));
    const maxList = getSpecificValueArr(data, 'max', (num) => +num.toFixed(2));
    const classNames = getSpecificValueArr(data, 'className');
    const option = {
      title: {
        text: '班级分数对比',
        textAlign: 'center',
        textStyle: {
          fontSize: 20,
          color: '#ffffff',
        },
        left: '50%',
        top: '5%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
      },
      legend: {
        show: true,
        type: 'plain',
        left: 'left',
        top: '4%',
        width: 20,
        textStyle: {
          color: 'rgba(186, 186, 186, 1)',
          fontWeight: 'bolder',
        },
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          color: '#ffffff',
        },
      },
      yAxis: {
        type: 'category',
        data: classNames,
        axisLabel: {
          color: '#ffffff',
        },
      },
      series: [
        {
          name: '平均分数',
          type: 'bar',
          data: avgList,
          showBackground: true,
        },
        {
          name: '最高分数',
          type: 'bar',
          data: maxList,
          showBackground: true,
        },
        {
          name: '中位分数',
          type: 'bar',
          data: midList,
          showBackground: true,
        },
      ],
      ...getYsilderOpt(8),
    };
    return option;
  };
  const drawChart = async () => {
    const res = await classScoreApi({ id: +id, page: 1, pageSize: 100 });
    const { list } = res.data;
    const opt = getOpt(list);
    chartOpt.value = opt;
  };

  drawChart();
</script>

<template>
  <div class="wh-full">
    <BaseChart
      auto-resize
      :options="chartOpt"
    />
  </div>
</template>
