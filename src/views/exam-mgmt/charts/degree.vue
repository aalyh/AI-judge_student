<script setup lang="ts">
  import { ref, watch } from 'vue';
  import BaseChart from '@/components/chart/index.vue';
  import { StuExamRank } from '@/api/data';

  const props = defineProps<{
    stuScoreList: StuExamRank[];
    passScore: number;
  }>();
  const chartOpt = ref({});
  const getOpt = (val: number) => {
    let text = '';
    if (val < 0.2) text = '较低';
    else if (val < 0.44) text = '适中';
    else text = '较难';
    const option = {
      title: {
        text: `试卷整体难度${text}`,
        textAlign: 'center',
        textStyle: {
          fontSize: 20,
          color: '#ffffff',
        },
        left: '50%',
        bottom: '5%',
      },
      series: [
        {
          name: '难度系数',
          type: 'gauge',
          center: ['50%', '50%'],
          min: 0,
          max: 1,
          startAngle: 200,
          endAngle: -20,
          splitNumber: 5,
          radius: '80%',
          title: {
            show: false,
            color: '#ffffff',
            fontSize: 24,
          },
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [0.3, '#f08080'],
                [0.7, '#ebcc7b'],
                [1, '#69d4b5'],
              ],
              width: 40,
              shadowColor: '#2C58A6', // 默认透明
              shadowBlur: 10,
            },
          },
          axisLabel: {
            // 坐标轴小标记
            distance: -5, // distance(-10)
            textStyle: {
              // 属性lineStyle控制线条样式
              fontWeight: 'normal',
              fontSize: 20,
              color: '#ffffff',
              shadowColor: '#2C58A6', // 默认透明
              shadowBlur: 20,
            },
          },
          progree: {
            width: 30,
          },
          axisTick: {
            // 坐标轴小标记
            show: false,
          },
          splitLine: {
            // 分隔线
            show: false,
          },
          pointer: {
            // 分隔线
            width: 5,
            // length:'70%'
          },
          detail: {
            backgroundColor: '#2C58A6',
            borderWidth: 1,
            borderColor: '#d5d5d5',
            shadowColor: '#2C58A6', // 默认透明
            shadowBlur: 16,
            padding: [5, 8, 5, 8],
            offsetCenter: [0, '50%'], // x, y，单位px
            textStyle: {
              fontWeight: 'normal',
              fontSize: 13,
              color: '#fff',
            },
            formatter() {
              return `难度系数: ${val}`;
            },
          },
          data: [{ name: '难度系数', value: val }],
        },
      ],
    };
    return option;
  };
  watch(
    () => props.stuScoreList,
    (newVal) => {
      const notPassValue = newVal.filter((item) => item.score < props.passScore).length;
      const degree = (notPassValue / newVal.length).toFixed(2);
      const val = Number.isNaN(+degree) ? 0.0 : +degree;
      chartOpt.value = getOpt(val);
    },
    { deep: true },
  );
</script>

<template>
  <div class="wh-full">
    <BaseChart
      :options="chartOpt"
      auto-resize
    />
  </div>
</template>
