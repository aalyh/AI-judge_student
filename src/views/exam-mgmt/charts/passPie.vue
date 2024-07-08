<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { type StuExamRank } from '@/api/data';
  import BaseChart from '@/components/chart/index.vue';

  const props = defineProps<{
    passScore: number;
    stuScoreList: StuExamRank[];
  }>();
  const chartOpt = ref({});
  // @ts-ignore
  const getOpt = (dataList) => {
    const colorList = ['#30C9C9', '#306FFF'];
    const option = {
      title: {
        text: '及格情况',
        textAlign: 'center',
        textStyle: {
          fontSize: 15,
          color: '#ffffff',
        },
        left: '50%',
        top: '0%',
      },
      legend: {
        // @ts-ignore
        data: dataList.map((item) => item.name),
        bottom: 0,
        itemWidth: 30,
        textStyle: {
          color: '#ffffff',
          fontWeight: 'bolder',
        },
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          label: {
            fontWeight: 'bold',
            // @ts-ignore
            formatter(params) {
              // eslint-disable-line
              return `${params.name}\n\n` + `${params.percent}%`; // eslint-disable-line
            },
          },
          labelLine: {
            length: 10,
            length2: 60,
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 2,
              // @ts-ignore
              color: (params) => {
                return colorList[params.dataIndex];
              },
            },
          },
          data: dataList,
        },
      ],
    };
    return option;
  };
  watch(
    () => props.stuScoreList,
    (newVal) => {
      const notPassValue = newVal.filter((item) => item.score < props.passScore).length;
      const passValue = newVal.length - notPassValue;
      const data = [
        { value: notPassValue, name: '不及格' },
        { value: passValue, name: '及格' },
      ];
      chartOpt.value = getOpt(data);
    },
    { deep: true },
  );
</script>

<template>
  <div class="wh-full">
    <BaseChart
      auto-resize
      :options="chartOpt"
    />
  </div>
</template>
