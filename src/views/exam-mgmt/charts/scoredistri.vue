<script setup lang="ts">
  import { ref, inject } from 'vue';
  import { gradeListApi } from '@/api/data';
  import BaseChart from '@/components/chart/index.vue';
  import { ExamListItem } from '@/api/exam';

  const examInfo = inject('examInfo');
  const { groupId } = examInfo as ExamListItem;
  const chartOpt = ref({});
  const range = [
    { min: -1, max: 30, name: '30分以下' },
    { min: 31, max: 60, name: '60分以下' },
    { min: 61, max: 90, name: '90分以下' },
    { min: 90, max: 110, name: '90 ~ 110分' },
    { min: 111, max: 120, name: '111 ~ 120分' },
    { min: 121, max: 130, name: '121 ~ 130分' },
    { min: 131, max: 150, name: '130分以上' },
  ];
  const getOpt = (dataList) => {
    const option = {
      title: {
        text: '分段人数统计',
        textAlign: 'center',
        textStyle: {
          fontSize: 15,
          color: '#ffffff',
        },
        left: '50%',
        top: '2%',
      },
      legend: {
        show: true,
        type: 'plain',
        left: '2%',
        top: '4%',
        width: 20,
        textStyle: {
          color: 'rgba(186, 186, 186, 1)',
          fontWeight: 'bolder',
        },
      },
      grid: {
        top: '5%',
        left: '2%',
        right: '4%',
        bottom: '0%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}人 ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: [25, 60],
          center: ['50%', '55%'],
          label: {
            show: false,
          },
          data: dataList,
        },
      ],
    };
    return option;
  };
  const drawChart = async () => {
    const res = await gradeListApi({ groupId: +groupId, caseRange: range });
    const { list } = res.data;
    const dataList = list.map((item) => {
      return {
        value: +item.value,
        name: item.name,
      };
    });
    chartOpt.value = getOpt(dataList);
  };
  drawChart();
</script>

<template>
  <div class="wh-full">
    <BaseChart
      auto-resize
      :options="chartOpt"
      auto-highlight
    />
  </div>
</template>
